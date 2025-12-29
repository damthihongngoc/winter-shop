import express from "express";
import {
  getOrders,
  getOrder,
  getUserOrders,
  createOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= ADMIN ================= */
// phải có token + role admin
router.get("/", verifyToken, getOrders);
router.get("/:id", verifyToken, getOrder);
router.put("/:id/status", verifyToken, updateOrderStatus);

/* ================= USER ================= */
// user đăng nhập mới tạo / xem đơn của mình
router.post("/", verifyToken, createOrder);
router.get("/user/:userId", verifyToken, getUserOrders);

export default router;
