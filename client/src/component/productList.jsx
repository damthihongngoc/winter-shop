import { useEffect, useState } from "react";
import "./style/productList.css";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Slider from "@mui/material/Slider";

const getMinPrice = (details = [], basePrice) => {
  if (!details.length) return basePrice;
  return Math.min(...details.map((d) => Number(d.price)));
};

const getUniqueValues = (details, key) => {
  return [...new Set(details.map((d) => d[key]))];
};

function ProductList({ categoryID = null, maxResponseProduct = null }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [itemsPerPage] = useState(12);

  // Available options từ products
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);

  const navigate = useNavigate();

  const fetchProduct = async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.categoryId) params.append("category_id", filters.categoryId);
      if (filters.minPrice) params.append("min_price", filters.minPrice);
      if (filters.maxPrice) params.append("max_price", filters.maxPrice);
      if (filters.colors?.length)
        params.append("colors", filters.colors.join(","));
      if (filters.sizes?.length)
        params.append("sizes", filters.sizes.join(","));
      if (filters.sortBy) params.append("sort", filters.sortBy);

      // Pagination params
      params.append("page", filters.page || 1);
      params.append("limit", maxResponseProduct || itemsPerPage);

      const url = `http://localhost:3001/api/products?${params.toString()}`;
      const response = await axios.get(url);

      console.log("response.data", response.data);

      setProducts(response.data.products);
      setTotalPages(response.data.pagination.totalPages);
      setTotalProducts(response.data.pagination.totalProducts);
      setCurrentPage(response.data.pagination.currentPage);

      // Extract available colors and sizes from products
      extractFilters(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const extractFilters = (products) => {
    const colors = new Set();
    const sizes = new Set();

    products.forEach((p) => {
      p.details?.forEach((d) => {
        if (d.color) colors.add(d.color);
        if (d.size) sizes.add(d.size);
      });
    });

    setAvailableColors([...colors]);
    setAvailableSizes([...sizes]);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/categories");
      console.log("Categories:", response.data);
      setCategories(response.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    categoryID,
    activeCategory,
    priceRange,
    selectedColors,
    selectedSizes,
    sortBy,
    currentPage,
    maxResponseProduct,
  ]);

  const applyFilters = () => {
    const filters = {
      categoryId: categoryID || activeCategory,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      colors: selectedColors,
      sizes: selectedSizes,
      sortBy: sortBy,
      page: currentPage,
    };
    fetchProduct(filters);
  };

  const handleSelectCategory = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentPage(1); // Reset về trang 1 khi đổi category
  };

  const handleColorToggle = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
    setCurrentPage(1); // Reset về trang 1
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setCurrentPage(1); // Reset về trang 1
  };

  const handlePriceChange = (e, newValue) => {
    setPriceRange(newValue);
  };

  const handlePriceChangeCommitted = () => {
    setCurrentPage(1); // Reset về trang 1 khi thay đổi giá
  };

  const resetFilters = () => {
    setPriceRange([0, 10000000]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setActiveCategory(null);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = async (detail_id) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

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

  const getPageTitle = () => {
    if (activeCategory === null) return "Tất cả sản phẩm";
    const currentCategory = categories.find(
      (c) => c.category_id === activeCategory
    );
    return currentCategory ? currentCategory.name : "Sản phẩm";
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="product-container">
      <div className="product-layout">
        {/* SIDEBAR FILTERS */}
        <aside className="filter-sidebar">
          <div className="filter-header">
            <h3>Bộ lọc</h3>
            <button className="reset-btn" onClick={resetFilters}>
              Đặt lại
            </button>
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Danh mục</h4>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  checked={activeCategory === null}
                  onChange={() => handleSelectCategory(null)}
                />
                <span>Tất cả</span>
              </label>
              {categories.map((cat) => (
                <label key={cat.category_id} className="filter-option">
                  <input
                    type="radio"
                    checked={activeCategory === cat.category_id}
                    onChange={() => handleSelectCategory(cat.category_id)}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Khoảng giá</h4>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              onChangeCommitted={handlePriceChangeCommitted}
              valueLabelDisplay="auto"
              min={0}
              max={10000000}
              step={50000}
              valueLabelFormat={(value) =>
                new Intl.NumberFormat("vi-VN").format(value) + " ₫"
              }
            />
            <div className="price-display">
              <span>
                {new Intl.NumberFormat("vi-VN").format(priceRange[0])} ₫
              </span>
              <span>
                {new Intl.NumberFormat("vi-VN").format(priceRange[1])} ₫
              </span>
            </div>
          </div>

          {/* Color Filter */}
          {availableColors.length > 0 && (
            <div className="filter-section">
              <h4 className="filter-title">Màu sắc</h4>
              <div className="filter-options">
                {availableColors.map((color) => (
                  <label key={color} className="filter-option">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={() => handleColorToggle(color)}
                    />
                    <span>{color}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Size Filter */}
          {availableSizes.length > 0 && (
            <div className="filter-section">
              <h4 className="filter-title">Kích cỡ</h4>
              <div className="filter-options size-options">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${
                      selectedSizes.includes(size) ? "active" : ""
                    }`}
                    onClick={() => handleSizeToggle(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <main className="product-main">
          <div className="product-header">
            <div className="header-left">
              <h2 className="page-title">{getPageTitle()}</h2>
              <p className="product-count">{totalProducts} sản phẩm</p>
            </div>
            <div className="sort-section">
              <label>Sắp xếp:</label>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
                <option value="name_asc">Tên A-Z</option>
                <option value="name_desc">Tên Z-A</option>
              </select>
            </div>
          </div>

          <div className="product-grid">
            {products?.map((product) => {
              const details = product.details || [];
              const displayImage = details[0]?.image || product.thumbnail;
              const minPrice = getMinPrice(details, product.price);
              const sizes = getUniqueValues(details, "size");
              const colors = getUniqueValues(details, "color");

              return (
                <div key={product.product_id} className="product-card">
                  <div
                    className="product-image-wrapper"
                    onClick={() => navigate(`/products/${product.product_id}`)}
                  >
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="product-image"
                    />
                  </div>

                  <div className="product-info">
                    <div className="product-variant">
                      <span className="size-badge">
                        +{sizes.length} kích cỡ
                      </span>
                      <span className="color-badge">
                        +{colors.length} màu sắc
                      </span>
                    </div>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-price">
                      {new Intl.NumberFormat("vi-VN").format(minPrice)} ₫
                    </div>
                    <div className="product-actions">
                      <button
                        className="detail-btn"
                        onClick={() =>
                          navigate(`/products/${product.product_id}`)
                        }
                      >
                        Chi tiết
                      </button>
                      <button
                        className="add-btn"
                        onClick={() => handleAddToCart(details[0]?.detail_id)}
                      >
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                ‹
              </button>

              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  className={`pagination-btn ${
                    page === currentPage ? "active" : ""
                  } ${page === "..." ? "dots" : ""}`}
                  onClick={() => page !== "..." && handlePageChange(page)}
                  disabled={page === "..."}
                >
                  {page}
                </button>
              ))}

              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                ›
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ProductList;
