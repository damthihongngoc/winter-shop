import pool from "../config/db.js";
import bcrypt from "bcryptjs";

// 🔹 Lấy tất cả users
export const getAllUsers = async () => {
  const [rows] = await pool.query(
    "SELECT user_id, name, email, phone, address, role, created_at, updated_at FROM users ORDER BY user_id DESC"
  );
  return rows;
};

// 🔹 Lấy user theo ID
export const getUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT user_id, name,password, email, phone, address, role, created_at, updated_at FROM users WHERE user_id = ?", [id]
  );
  return rows[0];
};

// 🔹 Tạo user
export const createUser = async (data) => {
  const { name, email, password, phone, address, role } = data;

  const hashed = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    `INSERT INTO users (name, email, password, phone, address, role) 
         VALUES (?, ?, ?, ?, ?, ?)`, [name, email, hashed, phone, address, role || "user"]
  );

  return { user_id: result.insertId, name, email, phone, address, role };
};

// 🔹 Update user (linh hoạt)
export const updateUser = async (id, data) => {
  const fields = [];
  const values = [];

  const addField = (column, value) => {
    if (value !== undefined && value !== null) {
      fields.push(`${column} = ?`);
      values.push(value);
    }
  };

  addField("name", data.name);
  addField("email", data.email);
  addField("phone", data.phone);
  addField("address", data.address);
  addField("role", data.role);

  // Nếu có password mới → hash
  if (data.password) {
    const hashed = await bcrypt.hash(data.password, 10);
    addField("password", hashed);
  }

  if (fields.length === 0) {
    return { message: "Không có trường nào để cập nhật!" };
  }

  values.push(id);

  const sql = `UPDATE users SET ${fields.join(", ")} WHERE user_id = ?`;
  await pool.query(sql, values);

  return { user_id: id, ...data };
};
export const changePassword = async (id, hashedPassword) => {
  const [result] = await pool.query(
    "UPDATE users SET password = ?, updated_at = NOW() WHERE user_id = ?", [hashedPassword, id]
  );

  return result.affectedRows > 0;
};
// 🔹 Xóa user
export const deleteUser = async (id) => {
  await pool.query("DELETE FROM users WHERE user_id = ?", [id]);
  return true;
};