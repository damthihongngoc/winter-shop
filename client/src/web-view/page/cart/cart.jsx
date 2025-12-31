import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./cart.scss";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // ⭐ danh sách sản phẩm được chọn
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const fetchCart = async () => {
    if (userId) {
      const res = await axios.get(`http://localhost:3001/api/cart/${userId}`);
      setCart(res.data.items);
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.user_id);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [userId]);

  // Toggle chọn 1 sản phẩm
  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  //  Chọn tất cả
  const selectAll = () => {
    const allIds = cart.map((item) => item.cart_item_id);
    setSelectedItems(allIds);
  };

  //  Bỏ chọn tất cả
  const unselectAll = () => {
    setSelectedItems([]);
  };
  //  Toggle chọn tất cả / bỏ chọn tất cả
  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      const allIds = cart.map((item) => item.cart_item_id);
      setSelectedItems(allIds);
    }
  };

  //  Thanh toán (lưu vào session)
  const handleCheckout = () => {
    const selectedProducts = cart.filter((item) =>
      selectedItems.includes(item.cart_item_id)
    );

    if (selectedProducts.length === 0) {
      alert("Vui lòng chọn sản phẩm để thanh toán!");
      return;
    }
    console.log("selectedProducts", selectedProducts);
    sessionStorage.setItem("checkout_items", JSON.stringify(selectedProducts));
    navigate("/orders");
  };

  // Tăng/giảm số lượng
  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;

    await axios.put(`http://localhost:3001/api/cart/${cartItemId}`, {
      quantity,
    });
    fetchCart();
  };

  const removeItem = async (cartItemId) => {
    await axios.delete(`http://localhost:3001/api/cart/${cartItemId}`);
    fetchCart();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="cart-container">
      <h2 className="cart-title">Giỏ hàng của bạn</h2>

      {/*  Buttons chọn tất cả / bỏ chọn */}
      {cart.length > 0 && (
        <div className="select-actions">
          <button onClick={toggleSelectAll}>
            {selectedItems.length === cart.length
              ? "Bỏ chọn tất cả"
              : "Chọn tất cả"}
          </button>
        </div>
      )}

      {cart.length === 0 && (
        <p className="empty-cart">Không có sản phẩm nào trong giỏ hàng.</p>
      )}

      {cart.map((item) => (
        <div key={item.cart_item_id} className="cart-item">
          {/* Checkbox chọn sản phẩm */}
          <input
            type="checkbox"
            checked={selectedItems.includes(item.cart_item_id)}
            onChange={() => toggleSelect(item.cart_item_id)}
            className="cart-checkbox"
            style={{
              width: "20px",
              height: "20px",
            }}
          />

          <img src={item.image} alt="" className="cart-item-image" />

          <div
            className="cart-item-info"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div style={{}}>
              <h3 className="product-name">{item.product_name}</h3>

              <p className="product-variant">
                Size: <span className="variant size">{item.size}</span>
                <span className="divider">•</span>
                Color: <span className="variant color">{item.color}</span>
              </p>
              <p className="product-price">
                {new Intl.NumberFormat("vi-VN").format(item?.price)} đ
              </p>
            </div>
            <div>
              {/* Total price */}
              <p
                className="item-total-price"
                style={{
                  fontWeight: 600,
                  marginBottom: "8px",
                  textAlign: "right",
                }}
              >
                Tổng:{" "}
                {new Intl.NumberFormat("vi-VN").format(
                  item.price * item.quantity
                )}{" "}
                đ
              </p>

              <div className="quantity-control">
                <button
                  style={{ margin: 0 }}
                  onClick={() =>
                    updateQuantity(item.cart_item_id, item.quantity - 1)
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  style={{ margin: 0 }}
                  onClick={() =>
                    updateQuantity(item.cart_item_id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              <button
                style={{ width: "100%" }}
                className="remove-btn"
                onClick={() => removeItem(item.cart_item_id)}
              >
                Xóa sản phẩm
              </button>
            </div>
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <button className="checkout-btn" onClick={handleCheckout}>
          Thanh toán
        </button>
      )}
    </div>
  );
}
