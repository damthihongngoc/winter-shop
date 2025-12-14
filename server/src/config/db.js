// config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // đọc biến môi trường từ .env

// Tạo pool kết nối
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
  queueLimit: 0,
});

// 🔍 Hàm test kết nối
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(" Kết nối MySQL thành công!");
    const [rows] = await connection.query("SELECT NOW() AS now");
    console.log(" Giờ hiện tại trong MySQL:", rows[0].now);
    connection.release(); // trả connection lại pool
  } catch (err) {
    console.error(" Lỗi kết nối MySQL:", err.message);
  }
};

// Gọi test khi file được import
testConnection();

export default pool;
