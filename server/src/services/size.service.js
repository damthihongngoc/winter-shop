import pool from "../config/db.js";

const getAllSizes = async() => {
    const [rows] = await pool.query("SELECT * FROM sizes ORDER BY size_id DESC");
    return rows;
};

const getSizeById = async(id) => {
    const [rows] = await pool.query("SELECT * FROM sizes WHERE id = ?", [id]);
    return rows[0];
};

const createSize = async(name) => {
    const [result] = await pool.query("INSERT INTO sizes (name) VALUES (?)", [
        name,
    ]);
    return { id: result.insertId, name };
};

const updateSize = async(id, name) => {
    await pool.query("UPDATE sizes SET name = ? WHERE id = ?", [name, id]);
    return { id, name };
};

const deleteSize = async(id) => {
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