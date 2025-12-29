import {
  getCartByUserService,
  addToCartService,
  updateCartItemService,
  deleteCartItemService,
  clearCartService,
  getTotalQuantityByUserService,
} from "../services/cart.service.js";

export const getCartByUser = async (req, res) => {
  try {
    const data = await getCartByUserService(req.params.userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};
export const getTotalQuantityByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const totalQuantity = await getTotalQuantityByUserService(userId);

    res.json({ totalQuantity });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching total cart quantity",
      error,
    });
  }
};
export const addToCart = async (req, res) => {
  try {
    const data = await addToCartService(req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const data = await updateCartItemService(
      req.params.cartItemId,
      req.body.quantity
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart item", error });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const data = await deleteCartItemService(req.params.cartItemId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error deleting cart item", error });
  }
};

export const clearCart = async (req, res) => {
  try {
    const data = await clearCartService(req.params.userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error });
  }
};
