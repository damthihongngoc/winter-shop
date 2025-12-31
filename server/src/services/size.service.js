import pool from "../config/db.js";

const getAllSizes = async (options = {}) => {
    const { page = 1, limit = 10 } = options;

    const [countResult] = await pool.query("SELECT COUNT(*) as total FROM sizes");
    const totalSizes = countResult[0].total;
    const totalPages = Math.ceil(totalSizes / limit);

    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
        "SELECT * FROM sizes ORDER BY size_id DESC LIMIT ? OFFSET ?",
        [limit, offset]
    );

    return {
        sizes: rows,
        pagination: {
            currentPage: page,
            totalPages,
            totalSizes,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
};

const getSizeById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM sizes WHERE id = ?", [id]);
    return rows[0];
};

const createSize = async (name) => {
    const [result] = await pool.query("INSERT INTO sizes (name) VALUES (?)", [
        name,
    ]);
    return { id: result.insertId, name };
};

const updateSize = async (id, name) => {
    await pool.query("UPDATE sizes SET name = ? WHERE id = ?", [name, id]);
    return { id, name };
};

const deleteSize = async (id) => {
    await pool.query("DELETE FROM sizes WHERE id = ?", [id]);
    return { message: "Size deleted successfully" };
};

export default {
    getAllSizes,
    getSizeById,
    createSize,
    updateSize,
    deleteSize,
};