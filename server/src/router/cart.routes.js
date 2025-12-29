import express from "express";
import {
  getCartByUser,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
  getTotalQuantityByUser,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/:userId", getCartByUser);
router.post("/", addToCart);
router.put("/:cartItemId", updateCartItem);
router.delete("/:cartItemId", deleteCartItem);
router.delete("/clear/:userId", clearCart);

//quality
router.get("/total/:userId", getTotalQuantityByUser);

export default router;
