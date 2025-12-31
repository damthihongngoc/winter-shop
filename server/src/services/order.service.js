import pool from "../config/db.js";
import { createAdminNotification, createNotification } from "./notification.service.js";

const PAYMENT_METHOD_VN = {
  cod: "Thanh toán tại nhà",
  momo: "Ví MoMo",
  vnpay: "VNPay",
};

// ✅ Khớp với database và frontend
const ORDER_STATUS_VN = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  shipping: "Đang giao hàng",
  received: "Đã nhận hàng",
  completed: "Đã hoàn thành",
  cancelled: "Đã huỷ",
};

const statusMessages = {
  pending: "đang chờ xử lý",
  processing: "đang được xử lý",
  shipping: "đang được giao",
  received: "đã được nhận",
  completed: "đã hoàn thành",
  cancelled: "đã bị hủy",
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

/**
 * USER tạo đơn hàng
 */
export const createOrder = async (data) => {
  // Validation
  if (!data.user_id) {
    throw new Error("user_id is required");
  }

  if (!data.items || data.items.length === 0) {
    throw new Error("Order must have at least one item");
  }

  if (!data.shipping_name || !data.shipping_phone || !data.shipping_address) {
    throw new Error("Shipping information is required");
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1️⃣ Kiểm tra tồn kho và tính tổng tiền
    let totalAmount = 0;

    for (const item of data.items) {
      if (!item.detail_id || !item.quantity || !item.price) {
        throw new Error("Invalid item data");
      }

      // Kiểm tra product detail và tồn kho
      const [[detail]] = await conn.query(
        `SELECT stock FROM product_details WHERE detail_id = ?`,
        [item.detail_id]
      );

      if (!detail) {
        throw new Error(`Product detail ${item.detail_id} not found`);
      }

      if (detail.stock < item.quantity) {
        throw new Error(
          `Không đủ hàng trong kho! Sản phẩm còn ${detail.stock} sản phẩm`
        );
      }

      totalAmount += item.price * item.quantity;
    }

    // 2️⃣ Tạo order - COD luôn là pending
    const [orderResult] = await conn.query(
      `INSERT INTO orders (
        user_id, 
        total_amount, 
        payment_method, 
        status,
        shipping_address,
        shipping_phone,
        shipping_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.user_id,
        totalAmount,
        data.payment_method || "cod",
        "pending", // ✅ Tất cả đơn mới đều là pending
        data.shipping_address,
        data.shipping_phone,
        data.shipping_name,
      ]
    );

    const orderId = orderResult.insertId;

    // Thông báo cho user
    await createNotification(
      data.user_id,
      "Đơn hàng mới",
      `Đơn hàng #${orderId} của bạn đã được tạo thành công. Tổng tiền: ${formatCurrency(totalAmount)}`,
      { order_id: orderId, type: "order_created" }
    );

    // Thông báo cho admin
    await createAdminNotification(
      "Đơn hàng mới",
      `Có đơn hàng mới #${orderId} từ khách hàng ${data.shipping_name}. Tổng tiền: ${formatCurrency(totalAmount)}`,
      { order_id: orderId, type: "new_order" }
    );

    // 3️⃣ Tạo order_details và giảm stock
    for (const item of data.items) {
      // Insert order detail
      await conn.query(
        `INSERT INTO order_details (order_id, detail_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.detail_id, item.quantity, item.price]
      );

      // Giảm số lượng tồn kho
      await conn.query(
        `UPDATE product_details 
         SET stock = stock - ? 
         WHERE detail_id = ?`,
        [item.quantity, item.detail_id]
      );
    }

    // 4️⃣ Lấy cart của user
    const [[cart]] = await conn.query(
      `SELECT cart_id FROM carts WHERE user_id = ?`,
      [data.user_id]
    );

    if (cart) {
      const detailIds = data.items.map((i) => i.detail_id);

      // 5️⃣ Xoá các item đã checkout khỏi cart_items
      if (detailIds.length > 0) {
        await conn.query(
          `DELETE FROM cart_items
           WHERE cart_id = ? AND detail_id IN (?)`,
          [cart.cart_id, detailIds]
        );
      }

      // 6️⃣ Kiểm tra nếu cart rỗng → xoá cart
      const [[count]] = await conn.query(
        `SELECT COUNT(*) AS total
         FROM cart_items
         WHERE cart_id = ?`,
        [cart.cart_id]
      );

      if (count.total === 0) {
        await conn.query(
          `DELETE FROM carts WHERE cart_id = ?`,
          [cart.cart_id]
        );
      }
    }

    await conn.commit();

    return {
      message: "Order created successfully",
      order_id: orderId,
      total_amount: totalAmount,
    };
  } catch (error) {
    await conn.rollback();
    console.error("Create order error:", error);
    throw error;
  } finally {
    conn.release();
  }
};

/**
 * ADMIN: Lấy tất cả đơn hàng
 */
export const getAllOrders = async (options = {}) => {
  const { page = 1, limit = 10 } = options;

  // Count total orders
  const [countResult] = await pool.query("SELECT COUNT(*) as total FROM orders");
  const totalOrders = countResult[0].total;
  const totalPages = Math.ceil(totalOrders / limit);

  // Calculate offset
  const offset = (page - 1) * limit;

  // Get paginated orders
  const [rows] = await pool.query(
    `
    SELECT
      o.order_id,
      o.total_amount,
      o.status,
      o.payment_method,
      o.created_at,
      o.updated_at,
      o.shipping_name,
      o.shipping_phone,
      o.shipping_address,

      u.user_id,
      u.name AS user_name,
      u.email AS user_email,
      u.phone AS user_phone,

      od.order_detail_id,
      od.quantity,
      od.price,

      p.product_id,
      p.name AS product_name,

      pd.image,

      s.name AS size,
      c.name AS color,
      c.hex_code

    FROM orders o
    LEFT JOIN users u ON o.user_id = u.user_id
    LEFT JOIN order_details od ON o.order_id = od.order_id
    LEFT JOIN product_details pd ON od.detail_id = pd.detail_id
    LEFT JOIN products p ON pd.product_id = p.product_id
    LEFT JOIN sizes s ON pd.size_id = s.size_id
    LEFT JOIN colors c ON pd.color_id = c.color_id

    ORDER BY o.created_at DESC
    LIMIT ? OFFSET ?
    `,
    [limit, offset]
  );

  const orderMap = new Map();

  for (const row of rows) {
    if (!orderMap.has(row.order_id)) {
      orderMap.set(row.order_id, {
        order_id: row.order_id,
        total_amount: row.total_amount,
        status: row.status,
        status_vn: ORDER_STATUS_VN[row.status] || row.status,
        payment_method: row.payment_method,
        payment_method_vn:
          PAYMENT_METHOD_VN[row.payment_method] || row.payment_method,
        // ✅ Đã thanh toán khi completed
        paid: row.status === "completed",

        shipping_name: row.shipping_name,
        shipping_phone: row.shipping_phone,
        shipping_address: row.shipping_address,

        user_id: row.user_id,
        user_name: row.user_name,
        user_email: row.user_email,
        user_phone: row.user_phone,

        created_at: row.created_at,
        updated_at: row.updated_at,

        items: [],
      });
    }

    // Nếu order có item
    if (row.order_detail_id) {
      orderMap.get(row.order_id).items.push({
        order_detail_id: row.order_detail_id,
        product_id: row.product_id,
        product_name: row.product_name,
        image: row.image,
        size: row.size,
        color: row.color,
        hex_code: row.hex_code,
        quantity: row.quantity,
        price: row.price,
      });
    }
  }

  const orders = Array.from(orderMap.values());

  return {
    orders,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalOrders: totalOrders,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

/**
 * ADMIN/USER: Chi tiết đơn hàng
 */
export const getOrderById = async (id) => {
  const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`;

  // 1. Lấy order + user info
  const [[order]] = await pool.query(
    `SELECT
      o.*,
      u.name AS user_name,
      u.email AS user_email,
      u.phone AS user_phone,
      u.address AS user_address
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.user_id
    WHERE o.order_id = ?`,
    [id]
  );

  if (!order) {
    return null;
  }

  // 2. Lấy chi tiết sản phẩm
  const [items] = await pool.query(
    `SELECT
      od.order_detail_id,
      od.quantity,
      od.price,
      p.product_id,
      p.name AS product_name,
      p.thumbnail,
      pd.image AS detail_image,
      s.name AS size,
      c.name AS color,
      c.hex_code
    FROM order_details od
    JOIN product_details pd ON od.detail_id = pd.detail_id
    JOIN products p ON pd.product_id = p.product_id
    JOIN sizes s ON pd.size_id = s.size_id
    JOIN colors c ON pd.color_id = c.color_id
    WHERE od.order_id = ?`,
    [id]
  );

  // 3. Map items với URL ảnh
  const mappedItems = items.map((item) => {
    let imageUrl = null;

    if (item.detail_image) {
      imageUrl = item.detail_image.startsWith('http')
        ? item.detail_image
        : `${BASE_URL}${item.detail_image}`;
    } else if (item.thumbnail) {
      imageUrl = item.thumbnail.startsWith('http')
        ? item.thumbnail
        : `${BASE_URL}${item.thumbnail}`;
    }

    return {
      ...item,
      image: imageUrl,
      total_price: item.price * item.quantity,
    };
  });

  return {
    ...order,
    // ✅ Đã thanh toán khi completed
    paid: order.status === "completed",
    payment_method_vn:
      PAYMENT_METHOD_VN[order.payment_method] || order.payment_method,
    status_vn: ORDER_STATUS_VN[order.status] || order.status,
    items: mappedItems,
  };
};

/**
 * USER: Lấy đơn hàng của user
 */
export const getOrdersByUser = async (userId) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  const [rows] = await pool.query(
    `SELECT * FROM orders 
     WHERE user_id = ? 
     ORDER BY created_at DESC`,
    [userId]
  );

  return rows.map((order) => ({
    ...order,
    // ✅ Đã thanh toán khi completed
    paid: order.status === "completed",
    payment_method_vn:
      PAYMENT_METHOD_VN[order.payment_method] || order.payment_method,
    status_vn: ORDER_STATUS_VN[order.status] || order.status,
  }));
};

/**
 * ADMIN/USER: Cập nhật trạng thái đơn hàng
 */
export const updateOrderStatus = async (orderId, status, userId = null, userRole = null) => {
  if (!orderId || !status) {
    throw new Error("orderId and status are required");
  }

  const validStatuses = Object.keys(ORDER_STATUS_VN);

  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status. Valid statuses: ${validStatuses.join(", ")}`);
  }

  // Kiểm tra order có tồn tại không
  const [[order]] = await pool.query(
    `SELECT order_id, status, user_id FROM orders WHERE order_id = ?`,
    [orderId]
  );

  if (!order) {
    throw new Error("Order not found");
  }

  // ✅ Kiểm tra quyền: USER chỉ được chuyển từ shipping -> received
  if (userRole !== "admin") {
    if (!userId || order.user_id !== userId) {
      throw new Error("You don't have permission to update this order");
    }

    if (order.status !== "shipping" || status !== "received") {
      throw new Error("You can only confirm received status when order is shipping");
    }
  }

  // ✅ Validation luồng trạng thái
  const STATUS_FLOW = ["pending", "processing", "shipping", "received", "completed"];
  const currentIndex = STATUS_FLOW.indexOf(order.status);
  const newIndex = STATUS_FLOW.indexOf(status);

  // Không cho phép quay lui (trừ cancelled)
  if (status !== "cancelled" && newIndex !== -1 && newIndex < currentIndex) {
    throw new Error("Cannot move order backwards in status flow");
  }

  // Chỉ cho phép cancelled khi đơn chưa shipping
  if (status === "cancelled" && !["pending", "processing"].includes(order.status)) {
    throw new Error("Can only cancel orders that are pending or processing");
  }

  // Cập nhật status
  await pool.query(
    `UPDATE orders SET status = ?, updated_at = NOW() WHERE order_id = ?`,
    [status, orderId]
  );

  // Thông báo cho user
  await createNotification(
    order.user_id,
    "Cập nhật đơn hàng",
    `Đơn hàng #${orderId} của bạn ${statusMessages[status] || status}.`,
    { order_id: orderId, status, type: "order_status_updated" }
  );

  return {
    message: "Order status updated successfully",
    order_id: orderId,
    old_status: order.status,
    old_status_vn: ORDER_STATUS_VN[order.status],
    new_status: status,
    new_status_vn: ORDER_STATUS_VN[status],
    paid: status === "completed", // ✅ Trả về paid status
  };
};