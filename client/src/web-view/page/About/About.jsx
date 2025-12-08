import "./About.css";
import { motion } from "framer-motion";

export default function About() {
  return (
    <>
      <div className="about-container">
        {/* 🌟 Tiêu đề trang */}
        <motion.h1
          className="about-title"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Về <span>WinterShop</span>
        </motion.h1>

        {/* 🧥 Giới thiệu chính */}
        <motion.p
          className="about-intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <strong>WinterShop</strong> là cửa hàng thời trang nam hiện đại, mang
          đến phong cách trẻ trung, năng động và lịch lãm cho phái mạnh. Chúng
          tôi luôn cập nhật những xu hướng mới nhất để giúp bạn tự tin thể hiện
          cá tính trong mọi hoàn cảnh.
        </motion.p>

        {/* 🧭 Section thông tin */}
        <motion.div
          className="about-sections"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.3 },
            },
          }}
        >
          {[
            {
              title: "🎯 Sứ mệnh",
              text: "Mang đến sản phẩm chất lượng với giá cả hợp lý, giúp nam giới tự tin thể hiện phong cách riêng.",
            },
            {
              title: "🧵 Sản phẩm",
              text: "Áo thun, sơ mi, quần tây, quần jean, giày và phụ kiện – tất cả đều được chọn lọc kỹ càng.",
            },
            {
              title: "🤝 Cam kết",
              text: "Hỗ trợ đổi trả trong 7 ngày, tư vấn nhiệt tình, giao hàng nhanh chóng và bảo mật thông tin khách hàng.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="about-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* 🖼️ Ảnh minh họa */}
        <motion.div
          className="about-image"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <img
            src="https://theme.hstatic.net/200000690725/1001078549/14/slide_1_img.jpg?v=928"
            alt="Thời trang nam"
          />
        </motion.div>
      </div>
    </>
  );
}
