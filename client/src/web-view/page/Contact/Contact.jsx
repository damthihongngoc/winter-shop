import "./Contact.css";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <>
      <div className="contact-container">
        {/* 🏷️ Tiêu đề */}
        <motion.h1
          className="contact-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Liên hệ với <span>WinterShop</span>
        </motion.h1>

        {/* 📞 Giới thiệu */}
        <motion.p
          className="contact-intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Nếu bạn có bất kỳ thắc mắc nào về sản phẩm, đơn hàng hoặc muốn hợp
          tác, hãy liên hệ với chúng tôi qua biểu mẫu hoặc thông tin bên dưới.
          <br />
          Đội ngũ <strong>WinterShop</strong> luôn sẵn sàng hỗ trợ bạn!
        </motion.p>

        {/* 🧾 Nội dung chính */}
        <div className="contact-content">
          {/* Form liên hệ */}
          <motion.div
            className="contact-quick"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h2>📞 Liên hệ nhanh</h2>
            <p>
              Bạn có thể liên hệ trực tiếp với <strong>WinterShop</strong> qua
              các kênh bên dưới để được hỗ trợ nhanh nhất.
            </p>

            <div className="contact-actions">
              <a href="tel:0987654321" className="phone">
                📞 Gọi ngay: 0987 654 321
              </a>

              <a href="https://zalo.me" target="_blank" className="zalo">
                💬 Chat Zalo
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                className="facebook"
              >
                📘 Fanpage Facebook
              </a>
            </div>
          </motion.div>

          {/* Thông tin liên hệ */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <h3>📍 Địa chỉ</h3>
            <p>123 Nguyễn Trãi, Quận 5, TP. Hồ Chí Minh</p>

            <h3>📞 Điện thoại</h3>
            <p>0987 654 321</p>

            <h3>✉️ Email</h3>
            <p>support@wintershop.vn</p>

            <h3>🕐 Giờ làm việc</h3>
            <p>Thứ 2 - CN: 8:00 - 21:00</p>
          </motion.div>

          <motion.div
            className="contact-quick"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h2>📍 Vị trí cửa hàng</h2>

            <iframe
              src="https://www.google.com/maps?q=Nguyễn+Trãi+Quận+5&output=embed"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: "12px" }}
              loading="lazy"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </>
  );
}
