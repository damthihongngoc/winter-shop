import express from "express";
import {
    getProducts,
    getProduct,
    createNewProduct,
    updateExistingProduct,
    deleteExistingProduct,
    getProductByCategory,
} from "../controllers/product.controller.js";

import upload from "../config/multerConfig.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", upload.single("thumbnail"), createNewProduct);
router.put("/:id", upload.single("thumbnail"), updateExistingProduct);
router.delete("/:id", deleteExistingProduct);
router.get("/category/:id", getProductByCategory);
export default router;