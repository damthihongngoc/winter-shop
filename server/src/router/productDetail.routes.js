import express from "express";
import {
    getAllProductDetails,
    getProductDetailById,
    createProductDetail,
    updateProductDetail,
    deleteProductDetail,
    getProductDetailsByCategory,
    getAllProductDetailById,
} from "../controllers/productDetail.controller.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

router.get("/", getAllProductDetails);
router.get("/:id", getProductDetailById);
router.get("/all/:id", getAllProductDetailById);
router.post("/", upload.single("image"), createProductDetail);
router.put("/:id", upload.single("image"), updateProductDetail);
router.delete("/:id", deleteProductDetail);
router.get("/category/:id", getProductDetailsByCategory);
export default router;