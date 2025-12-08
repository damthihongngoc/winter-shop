import express from "express";
import {
    getAllColors,
    getColorById,
    createColor,
    updateColor,
    deleteColor,
} from "../controllers/color.controller.js";

const router = express.Router();

router.get("/", getAllColors);
router.get("/:id", getColorById);
router.post("/", createColor);
router.put("/:id", updateColor);
router.delete("/:id", deleteColor);

export default router;