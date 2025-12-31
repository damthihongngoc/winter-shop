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

/* ================= USER ================= */
// ✅ Đặt routes cụ thể TRƯỚC routes có params để tránh conflict
router.post("/", verifyToken, createOrder);
router.get("/user/:userId", verifyToken, getUserOrders);

/* ================= ADMIN ================= */
// ✅ Route này phải đặt SAU routes cụ thể
router.get("/", verifyToken, getOrders);

/* ================= ADMIN/USER ================= */
// ✅ Routes có :id đặt cuối cùng
router.get("/:id", verifyToken, getOrder);
router.put("/:id/status", verifyToken, updateOrderStatus);

export default router;