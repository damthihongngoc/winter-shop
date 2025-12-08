import express from "express";
import {
    getBanners,
    getBanner,
    createBanner,
    updateBanner,
    deleteBanner,
    getPublicBanners,
} from "../controllers/banner.controller.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

router.get("/", getBanners);
router.get("/public", getPublicBanners);
router.get("/:id", getBanner);
router.post("/", upload.single("thumbnail"), createBanner);
router.put("/:id", upload.single("thumbnail"), updateBanner);
router.delete("/:id", deleteBanner);

export default router;