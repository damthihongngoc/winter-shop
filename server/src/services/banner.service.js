import pool from "../config/db.js";
const URL = `http://localhost:` + process.env.PORT + ``;

export const getAllBanners = async () => {
    const [rows] = await pool.query("SELECT * FROM banners ORDER BY banner_id DESC");
    const output = rows.map((item) => ({
        ...item,
        image: item.image ? URL + item.image : null,
    }));
    return output;
};

export const getAllBannersPublic = async () => {
    const [rows] = await pool.query(
        "SELECT * FROM banners WHERE status = 'active' ORDER BY banner_id DESC"
    );

    const output = rows.map((item) => ({
        ...item,
        image: item.image ? URL + item.image : null,
    }));

    return output;
};

export const getBannerById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM banners WHERE banner_id = ?", [id]);
    return rows[0];
};

export const createBanner = async (data) => {
    const { title, image, link } = data;
    const [result] = await pool.query(
        "INSERT INTO banners (title, image, link) VALUES (?, ?, ?)", [title, image, link]
    );
    return { id: result.insertId, ...data };
};
export const updateBanner = async (id, data) => {
    const fields = [];
    const values = [];

    // chỉ push field nếu có giá trị (khác undefined và null)
    const addField = (column, value) => {
        if (value !== undefined && value !== null) {
            fields.push(`${column} = ?`);
            values.push(value);
        }
    };

    addField("title", data.title);
    addField("image", data.image);
    addField("link", data.link);

    if (fields.length === 0) {
        return { message: "Không có trường nào để cập nhật!" };
    }

    values.push(id);

    const sql = `UPDATE banners SET ${fields.join(", ")} WHERE banner_id = ?`;
    console.log(sql);
    console.log(values);

    await pool.query(sql, values);

    return { banner_id: id, ...data };
};


export const deleteBanner = async (id) => {
    await pool.query("DELETE FROM banners WHERE banner_id = ?", [id]);
    return { message: "Banner deleted successfully" };
};