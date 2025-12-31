import { registerService, loginService } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
const JWT_SECRET = process.env.KEY_SECRET; // 👉 bạn nên để trong .env

export const verifyAdmin = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(401).json({
                EC: 1,
                EM: "No token provided",
                DT: { isAdmin: false },
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                EC: 1,
                EM: "Invalid or expired token",
                DT: { isAdmin: false },
            });
        }

        // Lấy role từ DB
        const [rows] = await pool.execute(
            "SELECT role FROM users WHERE user_id = ?",
            [decoded.user_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                EC: 1,
                EM: "User not found",
                DT: { isAdmin: false },
            });
        }

        const isAdmin = rows[0].role === "admin";

        return res.status(200).json({
            EC: 0,
            EM: "Verify admin success",
            DT: {
                isAdmin,
            },
        });
    } catch (error) {
        console.error("verifyAdmin error:", error);
        return res.status(500).json({
            EC: -1,
            EM: "Server error",
            DT: { isAdmin: false },
        });
    }
};

export const register = async (req, res) => {
    try {
        const user = await registerService(req.body);
        res.status(201).json({ message: "Đăng ký thành công!", user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await loginService(email, password);
        console.log("data controller:", data);
        res.json({ message: "Đăng nhập thành công!", data: data });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
export const checkRole = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token" });
        }

        let decoded;

        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ message: "Token expired" });
            }
            if (err instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ message: "Invalid token" });
            }
            return res.status(400).json({ message: "Token error" });
        }

        // Lấy full user info
        const [rows] = await pool.execute(
            `SELECT user_id, name, email, phone, address, role, created_at, updated_at
       FROM users WHERE user_id = ?`, [decoded.user_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = rows[0];

        return res.status(200).json({
            success: true,
            user,
            isAdmin: user.role === "admin",
        });

    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Bad request", error: err.message });
    }
};