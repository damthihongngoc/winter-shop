import { useNavigate } from "react-router-dom";
import "./home.css";
import { useState, useEffect } from "react";

// 🌀 Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import axios from "axios";
import CategoryList from "../../../component/CategoryList";
import SectionHome from "../../../component/SectionHome";

function Home() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState([]);

  // 🟦 Gọi API lấy danh sách ảnh
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/banners/public"
        );
        const data = response.data;
        console.log(data);
        setSlides(data.banners);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu slide:", error);
      }
    };

    fetchSlides();
  }, []);
  const handleNavigate = (item) => {
    if (item) {
      window.location.href = item.link;
    }
  };

  return (
    <div className="home-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop={false}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="mySwiper"
      >
        {slides.length > 0 ? (
          slides.map((item) => (
            <SwiperSlide key={item.banner_id}>
              <img
                onClick={() => handleNavigate(item)}
                src={item.image}
                alt={`Slide ${item.banner_id}`}
              />
            </SwiperSlide>
          ))
        ) : (
          <p>Đang tải ảnh...</p>
        )}
      </Swiper>

      <CategoryList />

      <SectionHome />
    </div>
  );
}

export default Home;
