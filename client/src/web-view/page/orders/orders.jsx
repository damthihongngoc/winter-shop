import React, { useState, useEffect } from "react";
import "./orders.scss";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSnackbar } from "notistack";
import { useCart } from "../../../hook/CartContext";
import axiosInstance from "../../../authentication/axiosInstance";

const OrdersPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { refreshCartQuantity } = useCart();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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

  // Dữ liệu địa chỉ (nên thay bằng API thực tế)
  const provinces = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Cần Thơ"];
  const districts = {
    "Hà Nội": ["Quận Ba Đình", "Quận Hoàn Kiếm", "Quận Đống Đa"],
    "TP. Hồ Chí Minh": ["Quận 1", "Quận 2", "Quận 3"],
    "Đà Nẵng": ["Quận Hải Châu", "Quận Thanh Khê"],
    "Cần Thơ": ["Quận Ninh Kiều", "Quận Cái Răng"],
  };
  const wards = {
    "Quận Ba Đình": ["Phường Trúc Bạch", "Phường Ngọc Hà"],
    "Quận 1": ["Phường Bến Nghé", "Phường Bến Thành"],
    "Quận Hải Châu": ["Phường Thanh Bình", "Phường Hải Châu 1"],
    "Quận Ninh Kiều": ["Phường An Phú", "Phường An Khánh"],
  };

  useEffect(() => {
    const checkoutItems = sessionStorage.getItem("checkout_items");
    if (checkoutItems) {
      try {
        const parsedItems = JSON.parse(checkoutItems);
        if (parsedItems && parsedItems.length > 0) {
          setItems(parsedItems);
        } else {
          enqueueSnackbar("Giỏ hàng trống!", { variant: "warning" });
          navigate("/cart");
        }
      } catch (error) {
        enqueueSnackbar("Lỗi đọc dữ liệu giỏ hàng!", { variant: "error" });
        navigate("/cart");
      }
    } else {
      enqueueSnackbar("Không có sản phẩm để thanh toán!", {
        variant: "warning",
      });
      navigate("/cart");
    }
  }, [navigate, enqueueSnackbar]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Reset district và ward khi đổi province
      if (name === "province") {
        newData.district = "";
        newData.ward = "";
      }
      // Reset ward khi đổi district
      if (name === "district") {
        newData.ward = "";
      }

      return newData;
    });
  };

  // Tính tổng tiền
  const subtotal = items.reduce((sum, item) => {
    return sum + parseFloat(item.price || 0) * (item.quantity || 0);
  }, 0);

  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const validateForm = () => {
    const { fullName, phone, address, province, district, ward } = formData;

    if (!fullName.trim()) {
      enqueueSnackbar("Vui lòng nhập họ tên!", { variant: "warning" });
      return false;
    }

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phone.trim() || !phoneRegex.test(phone)) {
      enqueueSnackbar("Số điện thoại không hợp lệ!", { variant: "warning" });
      return false;
    }

    if (!province || !district || !ward) {
      enqueueSnackbar("Vui lòng chọn đầy đủ địa chỉ!", { variant: "warning" });
      return false;
    }

    if (!address.trim()) {
      enqueueSnackbar("Vui lòng nhập địa chỉ cụ thể!", { variant: "warning" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (items.length === 0) {
      enqueueSnackbar("Giỏ hàng trống!", { variant: "warning" });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        enqueueSnackbar("Vui lòng đăng nhập để đặt hàng!", {
          variant: "warning",
        });
        navigate("/login");
        return;
      }

      const parseToken = jwtDecode(token);

      const orderPayload = {
        user_id: parseToken?.user_id,
        payment_method: formData.paymentMethod,
        shipping_address: `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.province}`,
        shipping_phone: formData.phone,
        shipping_name: formData.fullName,
        items: items.map((item) => ({
          detail_id: item.detail_id,
          quantity: item.quantity,
          price: parseFloat(item.price),
        })),
      };

      const res = await axiosInstance.post("/orders", orderPayload);

      enqueueSnackbar("Đặt hàng thành công!", { variant: "success" });

      // Xóa checkout items và refresh cart
      sessionStorage.removeItem("checkout_items");
      await refreshCartQuantity();

      // Chuyển đến trang order history hoặc order detail
      navigate(`/orders/${res.data.order_id}`);
    } catch (error) {
      console.error("Order error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Đặt hàng thất bại!";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <header className="checkout-header">
        <h1 className="logo">WINTERSHOP</h1>
        <p>Thanh toán {">"} Thông tin giao hàng</p>
      </header>

      <div className="checkout-content">
        {/* Form thông tin */}
        <div className="checkout-form">
          <h3>Thông tin giao hàng</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên *"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row form-row--split">
              <input
                type="email"
                name="email"
                placeholder="Email (không bắt buộc)"
                value={formData.email}
                onChange={handleInputChange}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại *"
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
                <option value="">Chọn Tỉnh/Thành *</option>
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
                disabled={!formData.province}
              >
                <option value="">Chọn Quận/Huyện *</option>
                {formData.province &&
                  districts[formData.province]?.map((d) => (
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
                disabled={!formData.district}
              >
                <option value="">Chọn Phường/Xã *</option>
                {formData.district &&
                  wards[formData.district]?.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-row">
              <input
                type="text"
                name="address"
                placeholder="Số nhà, tên đường *"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="shipping-method">
              <h3>Phương thức vận chuyển</h3>
              <div className="shipping-option">
                <div className="shipping-icon">📦</div>
                <p>Giao hàng tiêu chuẩn - {formatPrice(shippingFee)}</p>
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
              <p className="payment-note">
                Thanh toán bằng tiền mặt khi nhận hàng
              </p>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đặt hàng"}
            </button>
          </form>

          <Link to="/cart" className="back-link">
            ← Quay lại giỏ hàng
          </Link>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="order-summary">
          <h3>Đơn hàng ({items.length} sản phẩm)</h3>

          {items.map((item) => (
            <div
              key={item.cart_item_id || item.detail_id}
              className="summary-item"
            >
              <div className="wrapper-images">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.product_name}
                  className="item-image"
                />
                <span className="item-quantity">{item.quantity}</span>
              </div>
              <div className="item-info">
                <p className="item-name">{item.product_name}</p>
                <p className="item-variant">
                  {item.color} / {item.size}
                </p>
              </div>
              <p className="item-price">
                {formatPrice(parseFloat(item.price) * item.quantity)}
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
              <span className="final-price">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="checkout-footer">Powered by Haravan</footer>
    </div>
  );
};

export default OrdersPage;
