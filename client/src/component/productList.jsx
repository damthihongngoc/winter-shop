import { useEffect, useState } from "react";
import "./style/productList.css";
import axios from "axios";
import NotificationModal from "./NotificationModal";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

function ProductList({ categoryID = null }) {
  const [listProduct, setListProduct] = useState([]);
  const [openNotify, setOpenNotify] = useState({
    open: false,
    type: "",
    message: "",
  });
  const navigate = useNavigate();
  const fectchProduct = async (categoryID) => {
    try {
      const url = categoryID
        ? `http://localhost:3001/api/product-details/category/${categoryID}`
        : "http://localhost:3001/api/product-details";

      const response = await axios.get(url);
      setListProduct(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fectchProduct(categoryID);
  }, [categoryID]);

  /* ---------------- ADD TO CART ---------------- */
  const handleAddToCart = async (detail_id) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // 1. Chưa đăng nhập → báo lỗi + dừng
    if (!token || !user) {
      enqueueSnackbar("Vui lòng đăng nhập để thêm vào giỏ!", {
        variant: "warning",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/cart",
        {
          user_id: user.user_id,
          detail_id: detail_id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      enqueueSnackbar("Đã thêm vào giỏ!", { variant: "success" });
      console.log("Cart:", response.data);
    } catch (error) {
      enqueueSnackbar("Lỗi khi thêm vào giỏ", { variant: "error" });
      console.log(error);
    }
  };

  return (
    <>
      {" "}
      <div className="product-container">
        <div className="product-grid">
          {listProduct?.map((item) => (
            <div
              onClick={() => navigate(`/product-detail/${item.detail_id}`)}
              key={item.detail_id}
              className="product-card"
            >
              <div className="product-image-wrapper">
                <img
                  src={item.image}
                  alt={item.product_name}
                  className="product-image"
                />
              </div>

              <div className="product-info">
                <h3 className="product-name">{item.product_name}</h3>

                <div className="product-variant">
                  <span className="size-badge">Size: {item.size_name}</span>

                  <span className="color-badge">
                    Màu:
                    <span
                      className="color-dot"
                      style={{ backgroundColor: item.hex_code }}
                    />
                    {item.color_name}
                  </span>
                </div>

                <p className="product-price">
                  {new Intl.NumberFormat("vi-VN").format(item?.price)} ₫
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ProductList;
