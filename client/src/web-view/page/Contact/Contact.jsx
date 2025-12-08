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
          <motion.form
            className="contact-form"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            onSubmit={(e) => {
              e.preventDefault();
              alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");
            }}
          >
            <input type="text" placeholder="Họ và tên" required />
            <input type="email" placeholder="Email của bạn" required />
            <input type="text" placeholder="Số điện thoại" />
            <textarea placeholder="Nội dung cần liên hệ..." required></textarea>
            <button type="submit">Gửi liên hệ</button>
          </motion.form>

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
        </div>
      </div>
    </>
  );
}
