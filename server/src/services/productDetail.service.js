import pool from "../config/db.js";
const URL = `http://localhost:` + process.env.PORT + ``; // hoặc lấy từ config/env

export const getAllProductDetailsService = async () => {
    const [rows] = await pool.query(`
    SELECT pd.*, 
           p.name AS product_name, 
           s.name AS size_name, 
           c.name AS color_name, 
           c.hex_code
    FROM product_details pd
    JOIN products p ON pd.product_id = p.product_id
    JOIN sizes s ON pd.size_id = s.size_id
    JOIN colors c ON pd.color_id = c.color_id
    ORDER BY pd.detail_id DESC
  `);
    const output = rows.map((item) => ({
        ...item,
        image: item.image ? URL + item.image : null,
    }));

    return output;
};
export const getProductDetailsByCategoryServices = async (id) => {
    const [rows] = await pool.query(
        `
    SELECT pd.*, 
           p.name AS product_name, 
           s.name AS size_name, 
           c.name AS color_name, 
           c.hex_code
    FROM product_details pd
    JOIN products p ON pd.product_id = p.product_id
    JOIN sizes s ON pd.size_id = s.size_id
    JOIN colors c ON pd.color_id = c.color_id
    WHERE p.category_id = ?
    ORDER BY pd.detail_id DESC
  `, [id]
    );

    const output = rows.map((item) => ({
        ...item,
        image: item.image ? URL + item.image : null,
    }));

    return output;
};

// 🟢 Lấy theo ID
export const getProductDetailByIdService = async (id) => {
    const [rows] = await pool.query(
        "SELECT * FROM product_details WHERE detail_id = ?", [id]
    );
    return rows[0];
};

// 🟢 Thêm mới
export const createProductDetailService = async (data) => {
    const { product_id, size_id, color_id, stock, image, price } = data;

    const [result] = await pool.query(
        `
    INSERT INTO product_details (product_id, size_id, color_id, stock, image, price)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      stock = VALUES(stock),
      image = VALUES(image),
      price = VALUES(price)
    `, [product_id, size_id, color_id, stock || 0, image || null, price || null]
    );

    return result.insertId || result.affectedRows; // insertId nếu mới, affectedRows nếu update
};

//  Cập nhật
export const updateProductDetailService = async (id, data) => {
    // Lấy danh sách key-value hợp lệ
    const allowedFields = [
        "product_id",
        "size_id",
        "color_id",
        "stock",
        "image",
        "price",
    ];

    // Lọc ra những trường có tồn tại trong data
    const fields = [];
    const values = [];

    for (const key of allowedFields) {
        if (data[key] !== undefined && data[key] !== null) {
            fields.push(`${key} = ?`);
            values.push(data[key]);
        }
    }

    // Nếu không có gì để update → return 0
    if (fields.length === 0) return 0;

    // Thêm id vào cuối values cho WHERE
    values.push(id);

    const sql = `
        UPDATE product_details
        SET ${fields.join(", ")}
        WHERE detail_id = ?
    `;

    const [result] = await pool.query(sql, values);

    return result.affectedRows;
};

// 🟢 Xóa
export const deleteProductDetailService = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM product_details WHERE detail_id = ?", [id]
    );
    return result.affectedRows;
};


export const getAllProductDetailByIdService = async (detail_id) => {
    // 1. Lấy detail chính

    const [mainRows] = await pool.query(`
    SELECT pd.*, 
           p.name AS product_name, 
           p.description AS product_description,
           p.price AS product_price,
           p.thumbnail AS product_thumbnail,
           p.status AS product_status,
           p.created_at AS product_created_at,
           c2.category_id,
           c2.name AS category_name,
           c2.description AS category_description,
           s.name AS size_name,
           c.name AS color_name,
           c.hex_code
    FROM product_details pd
    JOIN products p ON pd.product_id = p.product_id
    JOIN categories c2 ON p.category_id = c2.category_id
    JOIN sizes s ON pd.size_id = s.size_id
    JOIN colors c ON pd.color_id = c.color_id
    WHERE pd.detail_id = ?
  `, [detail_id]);

    if (mainRows.length === 0) return null;

    const productDetailMain = {
        ...mainRows[0],
        image: mainRows[0].image ? URL + mainRows[0].image : null,
        product_thumbnail: mainRows[0].product_thumbnail ? URL + mainRows[0].product_thumbnail : null,
    };

    const productId = productDetailMain.product_id;

    // 2. Lấy toàn bộ product_detail khác (đầy đủ như main)
    const [otherRows] = await pool.query(`
    SELECT pd.*, 
           p.name AS product_name, 
           p.description AS product_description,
           p.price AS product_price,
           p.thumbnail AS product_thumbnail,
           p.status AS product_status,
           p.created_at AS product_created_at,
           c2.category_id,
           c2.name AS category_name,
           c2.description AS category_description,
           s.name AS size_name,
           c.name AS color_name,
           c.hex_code
    FROM product_details pd
    JOIN products p ON pd.product_id = p.product_id
    JOIN categories c2 ON p.category_id = c2.category_id
    JOIN sizes s ON pd.size_id = s.size_id
    JOIN colors c ON pd.color_id = c.color_id
    WHERE pd.product_id = ? AND pd.detail_id != ?
    ORDER BY pd.detail_id ASC
  `, [productId, detail_id]);

    const otherProductDetails = otherRows.map(item => ({
        ...item,
        image: item.image ? URL + item.image : null,
        product_thumbnail: item.product_thumbnail ? URL + item.product_thumbnail : null,
    }));

    // 3. Lấy danh sách ảnh
    const [allImgs] = await pool.query(`
    SELECT image FROM product_details WHERE product_id = ?
  `, [productId]);

    const images = allImgs
        .filter(x => x.image)
        .map(x => URL + x.image);

    return {
        productDetailMain,
        otherProductDetails,
        images,
    };
};