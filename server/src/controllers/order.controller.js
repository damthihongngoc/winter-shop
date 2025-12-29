import * as OrderService from "../services/order.service.js";

// ADMIN: lấy tất cả đơn
export const getOrders = async (req, res) => {
  try {
    const orders = await OrderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADMIN: lấy chi tiết đơn
export const getOrder = async (req, res) => {
  try {
    const order = await OrderService.getOrderById(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// USER: tạo đơn hàng
export const createOrder = async (req, res) => {
  try {
    const order = await OrderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// USER: xem đơn của mình
export const getUserOrders = async (req, res) => {
  try {
    const tokenUserId = Number(req.user.user_id);
    const paramUserId = Number(req.params.userId);

    // ❌ Không cho xem đơn người khác
    if (req.user.role !== "admin" && tokenUserId !== paramUserId) {
      return res.status(403).json({
        message: "Bạn không có quyền xem đơn hàng của người khác",
      });
    }

    const orders = await OrderService.getOrdersByUser(paramUserId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADMIN: cập nhật trạng thái đơn
export const updateOrderStatus = async (req, res) => {
  try {
    const result = await OrderService.updateOrderStatus(
      req.params.id,
      req.body.status
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
