import { useState } from "react";
import "./product-detail.scss";
import GalleryModal from "../../../component/GalleryModal";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function ProductDetail({ apiData }) {
  const { productDetailMain, otherProductDetails, images } = apiData;

  const [selectedDetail, setSelectedDetail] = useState(productDetailMain);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const allDetails = [productDetailMain, ...otherProductDetails];
console.log(productDetailMain)
  const colors = [
    ...new Map(
      allDetails.map((d) => [
        d.color_id,
        {
          id: d.color_id,
          name: d.color_name,
          thumbnail: d.color_thumbnail,
        },
      ])
    ).values(),
  ];

  // Lấy sizes theo màu đã chọn
  const sizesByColor = allDetails.filter(
    (d) => d.color_id === selectedDetail.color_id
  );

const promotions = [
  {
    icon: "🚚",
    text: "Giao hàng nhanh toàn quốc",
  },
  {
    icon: "🎁",
    text: "Tặng túi / hộp khi mua online",
  },
  {
    icon: "🔄",
    text: "Đổi trả trong 7 ngày nếu sản phẩm lỗi",
  },
  {
    icon: "🧵",
    text: "Cam kết sản phẩm chính hãng 100%",
  },
  {
    icon: "💬",
    text: "Hỗ trợ tư vấn trực tuyến 24/7",
  },
]
  const handleAddToCart = async (detail_id) => {
    const token = localStorage.getItem("token");
  
   const parseToken = jwtDecode(token)
    console.log(parseToken)
    // 1. Chưa đăng nhập → báo lỗi + dừng
    if (!token) {
      enqueueSnackbar("Vui lòng đăng nhập để thêm vào giỏ!", {
        variant: "warning",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/cart",
        {
          user_id: parseToken.user_id,
          detail_id: productDetailMain.detail_id,
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
      <div className="product-detail-container">
        {/* ===== PHẦN ẢNH ===== */}
        <div className="product-gallery">
          {/* Ảnh chính */}
          <div
            className="main-image-wrapper"
            onClick={() => setIsGalleryOpen(true)}
          >
            <img src={images[selectedImageIndex]} alt="Product main" />
            <div className="zoom-hint">Phóng to</div>
          </div>

          {/* Thumbnails ngang bên dưới */}
          <div className="thumbnails-horizontal">
            {images.map((img, index) => (
              <div
                key={index}
                className={`thumb-item ${
                  selectedImageIndex === index ? "active" : ""
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* ===== PHẦN THÔNG TIN ===== */}
        <div className="product-info">
          <h1 className="product-title">{selectedDetail.product_name}</h1>

          <div className="rating">★★★★★ 0 đánh giá</div>

          <div className="price-section">
            <span className="price">
              {Number(selectedDetail.price).toLocaleString("vi-VN")}đ
            </span>
          </div>

          {/* Khuyến mãi */}
        <div className="promotion-box">
  <div className="promotion-title">
    <span className="icon">⭐</span> ƯU ĐÃI KHI MUA ONLINE
  </div>

  <div className="promotion-list">
    {promotions.map((p, index) => (
      <div key={index} className="promotion-item">
        <span className="tag">{p.icon}</span>
        <span className="text">{p.text}</span>
      </div>
    ))}
  </div>
</div>


          {/* Màu sắc */}
          <div className="variant-section">
            <div className="variant-label">
              Màu sắc: <strong>{selectedDetail.color_name}</strong>
            </div>
            <div className="color-options">
              {colors.map((color) => (
                <button
                  key={color.id}
                  className={`color-btn ${
                    color.id === selectedDetail.color_id ? "active" : ""
                  }`}
                  onClick={() => {
                    const firstOfColor = allDetails.find(
                      (d) => d.color_id === color.id
                    );
                    setSelectedDetail(firstOfColor);
                    setSelectedImageIndex(0); // reset ảnh về đầu khi đổi màu
                  }}
                >
                  {/* <img src={color.thumbnail} alt={color.name} /> */}
                </button>
              ))}
            </div>
          </div>

          {/* Kích thước */}
          <div className="variant-section">
            <div className="variant-label">
              Kích thước: <strong>{selectedDetail.size_name}</strong>
              <a href="#" className="size-guide">
                Hướng dẫn chọn size
              </a>
            </div>
            <div className="size-options">
              {sizesByColor.map((size) => (
                <button
                  key={size.size_id}
                  className={`size-btn ${
                    size.size_id === selectedDetail.size_id ? "active" : ""
                  } ${size.stock === 0 ? "disabled" : ""}`}
                  onClick={() => setSelectedDetail(size)}
                  disabled={size.stock === 0}
                >
                  {size.size_name}
                </button>
              ))}
            </div>
          </div>

          {/* Số lượng & Nút mua */}
          <div className="action-section">
            <div className="quantity">
              <button>-</button>
              <span>1</span>
              <button>+</button>
            </div>

            <button className="add-to-cart" onClick={handleAddToCart}>THÊM VÀO GIỎ</button>
            <button className="buy-now">MUA NGAY</button>
          </div>

          {/* Tồn kho */}
          <div className="stock-info">
            Có <strong>23 sản phẩm</strong> còn sản phẩm này
          </div>

       
        
        </div>
      </div>

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <GalleryModal
          images={images}
          index={selectedImageIndex}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}
    </>
  );
}
