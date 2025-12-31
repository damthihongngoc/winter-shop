import * as OrderService from "../services/order.service.js";

/**
 * ADMIN: Lấy tất cả đơn hàng
 */
export const getOrders = async (req, res) => {
  try {
    // Chỉ admin mới được xem tất cả đơn hàng
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "You don't have permission to view all orders",
      });
    }

    const { page = 1, limit = 10 } = req.query;
    const result = await OrderService.getAllOrders({
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.status(200).json({
      success: true,
      data: result.orders,
      pagination: result.pagination,
      total: result.pagination.totalOrders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch orders",
    });
  }
};


/**
 * ADMIN/USER: Lấy chi tiết đơn hàng
 */
export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid order ID",
      });
    }

    const order = await OrderService.getOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Kiểm tra quyền truy cập (USER chỉ xem được đơn của mình)
    if (req.user.role !== "admin" && order.user_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        error: "You don't have permission to view this order",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch order",
    });
  }
};

/**
 * USER: Tạo đơn hàng
 */
export const createOrder = async (req, res) => {
  try {
    const { user_id, payment_method, shipping_address, shipping_phone, shipping_name, items, paid } = req.body;

    // Validation
    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: "user_id is required",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Order must have at least one item",
      });
    }

    if (!shipping_name || !shipping_phone || !shipping_address) {
      return res.status(400).json({
        success: false,
        error: "Shipping information is required",
      });
    }

    // Kiểm tra user_id từ token có khớp với user_id trong body không
    if (req.user.role !== "admin" && req.user.user_id !== user_id) {
      return res.status(403).json({
        success: false,
        error: "You can only create orders for yourself",
      });
    }

    // Validate từng item
    for (const item of items) {
      if (!item.detail_id || !item.quantity || !item.price) {
        return res.status(400).json({
          success: false,
          error: "Each item must have detail_id, quantity, and price",
        });
      }

      if (item.quantity <= 0 || item.price <= 0) {
        return res.status(400).json({
          success: false,
          error: "Quantity and price must be greater than 0",
        });
      }
    }

    const order = await OrderService.createOrder({
      ...req.body,
      paid: paid || false,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    // Xử lý các lỗi cụ thể
    if (error.message.includes("Insufficient stock") || error.message.includes("Không đủ hàng")) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || "Failed to create order",
    });
  }
};

/**
 * USER: Xem đơn hàng của mình
 */
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID",
      });
    }

    const tokenUserId = Number(req.user.user_id);
    const paramUserId = Number(userId);

    // Kiểm tra quyền: USER chỉ xem được đơn của mình, ADMIN xem được tất cả
    if (req.user.role !== "admin" && tokenUserId !== paramUserId) {
      return res.status(403).json({
        success: false,
        error: "You don't have permission to view these orders",
      });
    }

    const orders = await OrderService.getOrdersByUser(paramUserId);

    res.status(200).json({
      success: true,
      data: orders,
      total: orders.length,
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch user orders",
    });
  }
};

/**
 * ADMIN/USER: Cập nhật trạng thái đơn hàng
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid order ID",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status is required",
      });
    }

    // ✅ Pass userId và role để service kiểm tra quyền
    const result = await OrderService.updateOrderStatus(
      id,
      status,
      req.user.user_id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message.includes("Invalid status") || error.message.includes("permission")) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || "Failed to update order status",
    });
  }
};