import pool from "../config/db.js";

const getAllColors = async() => {
    const [rows] = await pool.query(
        "SELECT * FROM colors ORDER BY color_id DESC"
    );
    return rows;
};

const getColorById = async(id) => {
    const [rows] = await pool.query("SELECT * FROM colors WHERE color_id = ?", [
        id,
    ]);
    return rows[0];
};

const createColor = async(name, hex_code) => {
    const [result] = await pool.query(
        "INSERT INTO colors (name, hex_code) VALUES (?, ?)", [name, hex_code]
    );
    return { color_id: result.insertId, name, hex_code };
};

const updateColor = async(id, name, hex_code) => {
    await pool.query(
        "UPDATE colors SET name = ?, hex_code = ? WHERE color_id = ?", [name, hex_code, id]
    );
    return { color_id: id, name, hex_code };
};

const deleteColor = async(id) => {
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