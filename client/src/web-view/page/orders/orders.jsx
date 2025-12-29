import React, { useState, useEffect } from "react";
import "./orders.scss";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useCart } from "../../../hook/CartContext";
import axiosInstance from "../../../authentication/axiosInstance";
const OrdersPage = () => {
  const [items, setItems] = useState([]);
  const { refreshCartQuantity } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    paymentMethod: "cod",
  });

  // Giả lập dữ liệu địa chỉ (có thể thay bằng API thực tế)
  const provinces = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Cần Thơ"];
  const districts = [
    "Quận Ba Đình",
    "Quận 1",
    "Quận Hải Châu",
    "Quận Ninh Kiều",
  ];
  const wards = [
    "Phường Trúc Bạch",
    "Phường Bến Nghé",
    "Phường Thanh Bình",
    "Phường An Phú",
  ];

  useEffect(() => {
    const checkoutItems = sessionStorage.getItem("checkout_items");
    if (checkoutItems) {
      setItems(JSON.parse(checkoutItems));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Tính tổng tiền tạm tính
  const subtotal = items.reduce((sum, item) => {
    return sum + parseFloat(item.price) * item.quantity;
  }, 0);

  const shippingFee = 30000; // Giả sử phí ship cố định
  const total = subtotal + shippingFee;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        enqueueSnackbar("Vui lòng đăng nhập để thêm vào giỏ!", {
          variant: "warning",
        });
        return;
      }
      const parseToken = jwtDecode(token);
      const orderPayload = {
        user_id: parseToken?.user_id || null,
        payment_method: formData.paymentMethod,
        shipping_address: `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.province}`,
        shipping_phone: formData.phone,
        shipping_name: formData.fullName,
        items: items.map((item) => ({
          detail_id: item.detail_id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const res = await axiosInstance.post(
        "http://localhost:3001/api/orders",
        orderPayload
      );

      alert("Đặt hàng thành công!");
      refreshCartQuantity();
      navigate("/");
      console.log("Order response:", res.data);

      sessionStorage.removeItem("checkout_items");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="checkout-container">
      <header className="checkout-header">
        <h1 className="logo">WINTERSHOP</h1>
        <p>Thanh toán {">"} Thông tin giao hàng</p>
      </header>

      <div className="checkout-content">
        {/* Bên trái: Form thông tin */}
        <div className="checkout-form">
          <h3>Thông tin giao hàng</h3>
          <p>
            Bạn đã có tài khoản? <Link to={"/login"}>Đăng nhập</Link>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row form-row--split">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row form-row--split">
              <select
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                required
              >
                <option value="">Tỉnh thành</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <select
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                required
              >
                <option value="">Quận / huyện</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                name="ward"
                value={formData.ward}
                onChange={handleInputChange}
                required
              >
                <option value="">Phường / xã</option>
                {wards.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>{" "}
            <div className="form-row">
              <input
                type="text"
                name="address"
                placeholder="Địa chỉ đường"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="shipping-method">
              <h3>Phương thức vận chuyển</h3>
              <div className="shipping-option">
                <div className="shipping-icon">📦</div>
                <p>
                  Vui lòng chọn tỉnh / thành để có danh sách phương thức vận
                  chuyển.
                </p>
              </div>
            </div>
            <div className="payment-method">
              <h3>Phương thức thanh toán</h3>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleInputChange}
                />
                <span className="payment-label">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2331/2331941.png"
                    alt="COD"
                    width="24"
                  />
                  Thanh toán khi giao hàng (COD)
                </span>
              </label>
              <p className="payment-note">Lấy hàng rồi thanh toán tiền</p>
            </div>
            <button type="submit" className="submit-btn">
              Đặt hàng
            </button>
          </form>

          <Link to={"/cart"} className="back-link">
            ← Giỏ hàng
          </Link>
        </div>

        {/* Bên phải: Tóm tắt đơn hàng */}
        <div className="order-summary">
          {items.map((item) => (
            <div key={item.cart_item_id} className="summary-item">
              <div className="wrapper-images">
                <img
                  src={item.image}
                  alt={item.product_name}
                  className="item-image"
                />{" "}
                <span className="item-quantity">x{item.quantity}</span>
              </div>
              <div className="item-info">
                <p className="item-name">{item.product_name}</p>
                <p className="item-variant">
                  {item.color} / {item.size}
                </p>
              </div>
              <p className="item-price">
                {formatPrice(parseFloat(item.price))}
              </p>
            </div>
          ))}

          <div className="summary-total">
            <div className="total-row">
              <span>Tạm tính</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="total-row">
              <span>Phí vận chuyển</span>
              <span>{formatPrice(shippingFee)}</span>
            </div>
            <div className="total-row total-final">
              <span>Tổng cộng</span>
              <span className="final-price">VND {formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="checkout-footer">Powered by Haravan</footer>
    </div>
  );
};

export default OrdersPage;
