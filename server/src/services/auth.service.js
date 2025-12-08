import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.KEY_SECRET; // 👉 bạn nên để trong .env

// 🟢 Đăng ký
export const registerService = async(data) => {
    const { name, email, password, phone, address } = data;

    // Kiểm tra email trùng
    const [exists] = await pool.query("SELECT * FROM users WHERE email = ?", [
        email,
    ]);
    if (exists.length > 0) throw new Error("Email đã được sử dụng!");

    // Mã hóa mật khẩu
    const hashed = await bcrypt.hash(password, 10);

    // Thêm user
    const [result] = await pool.query(
        `INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)`, [name, email, hashed, phone || null, address || null]
    );

    return { user_id: result.insertId, name, email };
};

// 🟢 Đăng nhập
export const loginService = async(email, password) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);
        if (rows.length === 0) throw new Error("Email không tồn tại!");

        const user = rows[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error("Mật khẩu không đúng!");

        // Tạo token JWT
        const token = jwt.sign({ user_id: user.user_id, role: user.role, name: user.name },
            JWT_SECRET, { expiresIn: "7d" }
        );

        return {
            token,
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    } catch (error) {
        console.log('error', error)
    }
};