import pool from "../config/db.js";

export const CategoryService = {
    async getAll() {
        const [rows] = await pool.query(
            "SELECT * FROM categories ORDER BY created_at DESC"
        );
        const helo = 'oke bne'
        return rows;
    },

    async getById(id) {
        const [rows] = await pool.query(
            "SELECT * FROM categories WHERE category_id = ?", [id]
        );
        return rows[0];
    },

    async create(data) {
        const { name, description } = data;
        console.log("name", name);
        const [result] = await pool.query(
            "INSERT INTO categories (name, description) VALUES (?, ?)", [name, description]
        );
        return { id: result.insertId, name, description };
    },

    async update(id, data) {
        const { name, description } = data;
        await pool.query(
            "UPDATE categories SET name = ?, description = ? WHERE category_id = ?", [name, description, id]
        );
        return { id, name, description };
    },

    async remove(id) {
        await pool.query("DELETE FROM categories WHERE category_id = ?", [id]);
        return { message: "Deleted successfully" };
    },
};