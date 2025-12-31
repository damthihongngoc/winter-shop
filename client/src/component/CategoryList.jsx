import axios from "axios";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleCount = 4;
  const maxIndex = Math.max(categories.length - visibleCount, 0);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const fetchCategories = async () => {
    try {
      const url = "http://localhost:3001/api/categories";
      const response = await axios.get(url);
      setCategories(response.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        padding: 50,
        marginTop: 50,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#333",
          marginBottom: 20,
        }}
      >
        <h2>DANH MỤC SẢN PHẨM</h2>

        {/* Swiper buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={handlePrev}>
            <FaArrowLeft />
          </Button>
          <Button onClick={handleNext}>
            <FaArrowRight />
          </Button>
        </div>
      </div>

      <div
        style={{
          overflow: "hidden",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 20,
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
            transition: "transform 0.4s ease",
          }}
        >
          {categories.map((category) => (
            <div
              key={category.category_id}
              style={{
                flex: `0 0 calc(${100 / visibleCount}% - 15px)`,
                position: "relative",
                overflow: "hidden",
                borderRadius: 8,
              }}
            >
              <img
                src={category.image}
                alt={category.name}
                style={{
                  width: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* Overlay title */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(255, 255, 255, 0.45)",
                  backdropFilter: "blur(4px)",
                  fontWeight: 600,
                  color: "#333",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{category.name}</span>
                  <Button onClick={() => navigate(`/products`)}>
                    <FaArrowRight />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
