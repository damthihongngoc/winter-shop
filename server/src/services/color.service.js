import pool from "../config/db.js";

const getAllColors = async (options = {}) => {
    const { page = 1, limit = 10 } = options;

    const [countResult] = await pool.query("SELECT COUNT(*) as total FROM colors");
    const totalColors = countResult[0].total;
    const totalPages = Math.ceil(totalColors / limit);

    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
        "SELECT * FROM colors ORDER BY color_id DESC LIMIT ? OFFSET ?",
        [limit, offset]
    );

    return {
        colors: rows,
        pagination: {
            currentPage: page,
            totalPages,
            totalColors,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
};

const getColorById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM colors WHERE color_id = ?", [
        id,
    ]);
    return rows[0];
};

const createColor = async (name, hex_code) => {
    const [result] = await pool.query(
        "INSERT INTO colors (name, hex_code) VALUES (?, ?)", [name, hex_code]
    );
    return { color_id: result.insertId, name, hex_code };
};

const updateColor = async (id, name, hex_code) => {
    await pool.query(
        "UPDATE colors SET name = ?, hex_code = ? WHERE color_id = ?", [name, hex_code, id]
    );
    return { color_id: id, name, hex_code };
};

const deleteColor = async (id) => {
    await pool.query("DELETE FROM colors WHERE color_id = ?", [id]);
    return { message: "Color deleted successfully" };
};

export default {
    getAllColors,
    getColorById,
    createColor,
    updateColor,
    deleteColor,
};