import pool from "../config/db.js";

const PAYMENT_METHOD_VN = {
  cod: "Thanh toán tại nhà",
  momo: "Ví MoMo",
  vnpay: "VNPay",
};

const ORDER_STATUS_VN = {
  pending: "Chờ xử lý",
  paid: "Đã thanh toán",
  shipped: "Đang giao hàng",
  delivered: "Đã giao hàng",
  cancelled: "Đã huỷ",
  processing: "Đang xử lý",
};

/**
 * USER tạo đơn hàng
 * body:
 * {
 *   user_id,
 *   payment_method,
 *   items: [
 *      { detail_id, quantity, price }
 *   ]
 * }
 */
export const createOrder = async (data) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1️⃣ Tính tổng tiền
    const totalAmount = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 2️⃣ Tạo order
    const [orderResult] = await conn.query(
      `
      INSERT INTO orders (user_id, total_amount, payment_method, status,shipping_address,shipping_phone,shipping_name)
      VALUES (?, ?, ?, 'pending',?,?,?)
      `,
      [
        data.user_id,
        totalAmount,
        data.payment_method,
        data.shipping_address,
        data.shipping_phone,
        data.shipping_name,
      ]
    );

    const orderId = orderResult.insertId;

    // 3️⃣ Tạo order_details
    for (const item of data.items) {
      await conn.query(
        `
        INSERT INTO order_details (order_id, detail_id, quantity, price)
        VALUES (?, ?, ?, ?)
        `,
        [orderId, item.detail_id, item.quantity, item.price]
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
      await conn.query(
        `
        DELETE FROM cart_items
        WHERE cart_id = ?
        AND detail_id IN (?)
        `,
        [cart.cart_id, detailIds]
      );

      // 6️⃣ (Tuỳ chọn) Nếu cart rỗng → xoá cart
      const [[count]] = await conn.query(
        `
        SELECT COUNT(*) AS total
        FROM cart_items
        WHERE cart_id = ?
        `,
        [cart.cart_id]
      );

      if (count.total === 0) {
        await conn.query(`DELETE FROM carts WHERE cart_id = ?`, [cart.cart_id]);
      }
    }

    await conn.commit();

    return {
      message: "Order created successfully",
      order_id: orderId,
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

// ADMIN: tất cả đơn
export const getAllOrders = async () => {
  const [rows] = await pool.query(`
    SELECT
      o.order_id,
      o.total_amount,
      o.status,
      o.payment_method,
      o.created_at,
      o.updated_at,
      o.shipping_phone,
      o.shipping_name,
      o.shipping_address,

      u.user_id,
      u.name   AS user_name,
      u.email  AS user_email,
      u.phone  AS user_phone

    FROM orders o
    LEFT JOIN users u ON o.user_id = u.user_id
    ORDER BY o.order_id DESC
  `);

  // 🔹 Map thêm tiếng Việt
  const mappedOrders = rows.map((order) => ({
    ...order,

    payment_method_vn:
      PAYMENT_METHOD_VN[order.payment_method] || order.payment_method,

    status_vn: ORDER_STATUS_VN[order.status] || order.status,
  }));

  return mappedOrders;
};

// ADMIN: chi tiết đơn
export const getOrderById = async (id) => {
  const URL = `http://localhost:${process.env.PORT}`;

  // 🔹 1. Lấy order + user
  const [[order]] = await pool.query(
    `
    SELECT
      o.*,
      u.name   AS user_name,
      u.email  AS user_email,
      u.phone  AS user_phone,
      u.address AS user_address
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.user_id
    WHERE o.order_id = ?
    `,
    [id]
  );

  if (!order) return null;

  // 🔹 2. Lấy chi tiết + product
  const [items] = await pool.query(
    `
    SELECT
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
    WHERE od.order_id = ?
    `,
    [id]
  );

  // 🔹 3. Map items + nối ảnh
  const mappedItems = items.map((item) => ({
    ...item,
    image: item.detail_image
      ? `${URL}${item.detail_image}`
      : item.thumbnail
      ? `${URL}${item.thumbnail}`
      : null,

    total_price: item.price * item.quantity,
  }));

  return {
    ...order,

    payment_method_vn:
      PAYMENT_METHOD_VN[order.payment_method] || order.payment_method,

    status_vn: ORDER_STATUS_VN[order.status] || order.status,

    items: mappedItems,
  };
};

// USER: đơn của user
export const getOrdersByUser = async (userId) => {
  const [rows] = await pool.query(
    `SELECT * FROM orders WHERE user_id = ? ORDER BY order_id DESC`,
    [userId]
  );

  return rows.map((order) => ({
    ...order,

    payment_method_vn:
      PAYMENT_METHOD_VN[order.payment_method] || order.payment_method,

    status_vn: ORDER_STATUS_VN[order.status] || order.status,
  }));
};
// ADMIN: cập nhật status
export const updateOrderStatus = async (orderId, status) => {
  await pool.query(`UPDATE orders SET status = ? WHERE order_id = ?`, [
    status,
    orderId,
  ]);
  return { message: "Order status updated" };
};
