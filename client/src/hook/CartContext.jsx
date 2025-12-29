import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartQuantity, setCartQuantity] = useState(0);

  const fetchCartQuantity = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCartQuantity(0);
      return;
    }

    const { user_id } = jwtDecode(token);

    try {
      const res = await axios.get(
        `http://localhost:3001/api/cart/total/${user_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCartQuantity(Number(res.data.totalQuantity) || 0);
    } catch (error) {
      console.error("Lỗi lấy số lượng giỏ hàng", error);
    }
  }, []);

  useEffect(() => {
    fetchCartQuantity();
  }, [fetchCartQuantity]);

  return (
    <CartContext.Provider
      value={{ cartQuantity, refreshCartQuantity: fetchCartQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
