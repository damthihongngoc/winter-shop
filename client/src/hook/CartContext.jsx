import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../authentication/axiosInstance";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartQuantity, setCartQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCartQuantity = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCartQuantity(0);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const { user_id } = decoded;

      if (!user_id) {
        setCartQuantity(0);
        return;
      }

      setLoading(true);

      const res = await axiosInstance.get(`/cart/total/${user_id}`);

      setCartQuantity(Number(res.data.totalQuantity) || 0);
    } catch (error) {
      console.error("Lỗi lấy số lượng giỏ hàng:", error);

      // Nếu token hết hạn hoặc không hợp lệ
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        setCartQuantity(0);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch cart quantity khi mount
  useEffect(() => {
    fetchCartQuantity();
  }, [fetchCartQuantity]);

  // Listen cho sự kiện login/logout
  useEffect(() => {
    const handleStorageChange = () => {
      fetchCartQuantity();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [fetchCartQuantity]);

  return (
    <CartContext.Provider
      value={{
        cartQuantity,
        refreshCartQuantity: fetchCartQuantity,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};
