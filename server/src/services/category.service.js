import pool from "../config/db.js";

export const CategoryService = {
    async getAll(options = {}) {
        const { page = 1, limit = 10 } = options;

        const [countResult] = await pool.query("SELECT COUNT(*) as total FROM categories");
        const totalCategories = countResult[0].total;
        const totalPages = Math.ceil(totalCategories / limit);

        const offset = (page - 1) * limit;
        const [rows] = await pool.query(
            "SELECT * FROM categories ORDER BY created_at DESC LIMIT ? OFFSET ?",
            [limit, offset]
        );

        return {
            categories: rows,
            pagination: {
                currentPage: page,
                totalPages,
                totalCategories,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
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