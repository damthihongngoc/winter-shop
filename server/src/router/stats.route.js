import express from "express";
import {
    getOverviewStats,
    getRevenueStats,
    getOrderStatusStats,
    getTopProducts,
    getCategoryStats,
} from "../controllers/stats.controller.js";

const router = express.Router();

router.get("/overview", getOverviewStats);
router.get("/revenue", getRevenueStats);
router.get("/order-status", getOrderStatusStats);
router.get("/top-products", getTopProducts);
router.get("/category", getCategoryStats);

export default router;