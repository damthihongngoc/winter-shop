import { useState, useEffect } from "react";
import "./product-detail.scss";
import GalleryModal from "../../../component/GalleryModal";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCart } from "../../../hook/CartContext";

export default function ProductDetail({ productData }) {
  const { refreshCartQuantity } = useCart();
  const [openSizeGuide, setOpenSizeGuide] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // ⭐ KHỞI TẠO GIÁ TRỊ ĐẦU TIÊN
  useEffect(() => {
    if (productData.details && productData.details.length > 0) {
      const firstDetail = productData.details[0];
      setSelectedColor(firstDetail.color);
      setSelectedSize(firstDetail.size);
      setSelectedDetail(firstDetail);
    }
  }, [productData]);

  // ⭐ LẤY DANH SÁCH MÀU UNIQUE
  const colors = Array.from(
    new Map(
      productData.details.map((d) => [
        d.color, // key = color name
        { name: d.color, hexCode: d.hexCode },
      ])
    ).values()
  );

  // ⭐ LẤY DANH SÁCH SIZE THEO MÀU ĐÃ CHỌN
  const availableSizes = productData.details
    .filter((d) => d.color === selectedColor)
    .map((d) => ({
      size: d.size,
      stock: d.stock,
      detail: d,
    }));

  // ⭐ TẠO DANH SÁCH ẢNH (có thể mở rộng sau)
  // Hiện tại: lấy ảnh từ thumbnail của product + image của các details
  const images = [
    productData.thumbnail,
    ...productData.details
      .map((d) => d.image)
      .filter((img) => img !== productData.thumbnail),
  ].filter(Boolean); // Loại bỏ null/undefined

  // ⭐ XỬ LÝ KHI CHỌN MÀU
  const handleColorChange = (color) => {
    setSelectedColor(color);
    // Tự động chọn size đầu tiên của màu mới
    const firstSizeOfColor = productData.details.find((d) => d.color === color);
    if (firstSizeOfColor) {
      setSelectedSize(firstSizeOfColor.size);
      setSelectedDetail(firstSizeOfColor);
      setSelectedImageIndex(0);
    }
  };

  // ⭐ XỬ LÝ KHI CHỌN SIZE
  const handleSizeChange = (size, detail) => {
    setSelectedSize(size);
    setSelectedDetail(detail);
  };

  const handleIncrease = () => {
    if (selectedDetail && quantity < selectedDetail.stock) {
      setQuantity((prev) => prev + 1);
    } else {
      enqueueSnackbar("Đã đạt số lượng tối đa trong kho", {
        variant: "warning",
      });
    }
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      enqueueSnackbar("Vui lòng đăng nhập để thêm vào giỏ!", {
        variant: "warning",
      });
      return;
    }

    if (!selectedDetail) {
      enqueueSnackbar("Vui lòng chọn màu và size", { variant: "warning" });
      return;
    }

    if (selectedDetail.stock === 0) {
      enqueueSnackbar("Sản phẩm đã hết hàng", { variant: "error" });
      return;
    }

    const parseToken = jwtDecode(token);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/cart",
        {
          user_id: parseToken.user_id,
          detail_id: selectedDetail.detail_id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        refreshCartQuantity();
        enqueueSnackbar(`Đã thêm ${quantity} sản phẩm vào giỏ!`, {
          variant: "success",
        });
        setQuantity(1); // Reset về 1
      }
    } catch (error) {
      enqueueSnackbar("Lỗi khi thêm vào giỏ", { variant: "error" });
      console.log(error);
    }
  };

  const promotions = [
    { icon: "🚚", text: "Giao hàng nhanh toàn quốc" },
    { icon: "🎁", text: "Tặng túi / hộp khi mua online" },
    { icon: "🔄", text: "Đổi trả trong 7 ngày nếu sản phẩm lỗi" },
    { icon: "🧵", text: "Cam kết sản phẩm chính hãng 100%" },
    { icon: "💬", text: "Hỗ trợ tư vấn trực tuyến 24/7" },
  ];

  return (
    <>
      <div className="product-detail-container">
        {/* ===== PHẦN ẢNH ===== */}
        <div className="product-gallery">
          <div
            className="main-image-wrapper"
            onClick={() => setIsGalleryOpen(true)}
          >
            <img
              src={
                selectedDetail?.image ||
                images[selectedImageIndex] ||
                productData.thumbnail
              }
              alt="Product main"
            />
            <div className="zoom-hint">Phóng to</div>
          </div>

          {/* Thumbnails */}
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
          <h1 className="product-title">{productData.name}</h1>

          <div className="price-section">
            <span className="price">
              {Number(
                selectedDetail?.price || productData.price
              ).toLocaleString("vi-VN")}
              đ
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

          {/* ⭐ MÀU SẮC - LOGIC MỚI */}
          <div className="variant-section">
            <div className="variant-label">
              Màu sắc: <strong>{selectedColor}</strong>
            </div>
            <div className="color-options">
              {colors.map((color) => (
                <button
                  key={color.name}
                  style={{
                    background: color.hexCode || "#ccc",
                  }}
                  className={`color-btn ${
                    color.name === selectedColor ? "active" : ""
                  }`}
                  onClick={() => handleColorChange(color.name)}
                >
                  {/* {color} */}
                </button>
              ))}
            </div>
          </div>

          {/* ⭐ KÍCH THƯỚC - LOGIC MỚI */}
          <div className="variant-section">
            <div className="variant-label">
              Kích thước: <strong>{selectedSize}</strong>
              <button
                type="button"
                className="size-guide"
                onClick={() => setOpenSizeGuide(true)}
              >
                Hướng dẫn chọn size
              </button>
            </div>
            <div className="size-options">
              {availableSizes.map(({ size, stock, detail }) => (
                <button
                  key={size}
                  className={`size-btn ${
                    size === selectedSize ? "active" : ""
                  } ${stock === 0 ? "disabled" : ""}`}
                  onClick={() => handleSizeChange(size, detail)}
                  disabled={stock === 0}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Số lượng & Nút mua */}
          <div className="action-section">
            <div className="quantity">
              <button
                style={{ margin: 0, height: "100%" }}
                onClick={handleDecrease}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                style={{ margin: 0, height: "100%" }}
                onClick={handleIncrease}
              >
                +
              </button>
            </div>

            <button
              className="add-to-cart"
              style={{ margin: 0, height: "100%" }}
              onClick={handleAddToCart}
              disabled={!selectedDetail || selectedDetail.stock === 0}
            >
              {selectedDetail?.stock === 0 ? "HẾT HÀNG" : "THÊM VÀO GIỎ"}
            </button>
          </div>

          {/* Tồn kho */}
          <div className="stock-info">
            Còn <strong>{selectedDetail?.stock || 0}</strong> sản phẩm trong
            kho.
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

      {openSizeGuide && (
        <div
          className="size-guide-modal"
          onClick={() => setOpenSizeGuide(false)}
        >
          <div
            className="size-guide-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="https://file.hstatic.net/1000184601/file/01_7d60048803214e62bd2bcbc4a3e6da81.png"
              alt="Hướng dẫn chọn size"
            />
          </div>
        </div>
      )}
    </>
  );
}
