import pool from "../config/db.js";
const URL = `http://localhost:` + process.env.PORT + ``; // hoặc lấy từ config/env
// 🟢 Lấy tất cả sản phẩm (kèm tên danh mục)
export const getAllProducts = async () => {
    const [rows] = await pool.query(`
    SELECT p.*, c.name AS category_name
    FROM products p
    JOIN categories c ON p.category_id = c.category_id
    ORDER BY p.created_at DESC
  `);

    const output = rows.map((item) => ({
        ...item,
        thumbnail: item.thumbnail ? URL + item.thumbnail : null,
    }));

    return output;
};

// 🟢 Lấy sản phẩm theo ID
export const getProductById = async (id) => {
    const [rows] = await pool.query(
        `
    SELECT p.*, c.name AS category_name
    FROM products p
    JOIN categories c ON p.category_id = c.category_id
    WHERE p.product_id = ?
    `, [id]
    );
    return rows[0];
};
export const getProductByCategoryID = async (id) => {
    const [rows] = await pool.query(
        `
        SELECT 
            pd.detail_id,
            pd.price AS detail_price,
            pd.stock,
            pd.image AS detail_image,

            s.name AS size_name,
            c.name AS color_name,

            p.product_id,
            p.name AS product_name,
            p.thumbnail AS product_thumbnail,
            p.description,
            p.price AS product_base_price,

            cg.category_id,
            cg.name AS category_name
        FROM product_details pd
        JOIN products p ON pd.product_id = p.product_id
        JOIN categories cg ON p.category_id = cg.category_id
        JOIN sizes s ON pd.size_id = s.size_id
        JOIN colors c ON pd.color_id = c.color_id
        WHERE p.category_id = ?;
        `, [id]
    );

    const output = rows.map((item) => ({
        detail_id: item.detail_id,
        product_id: item.product_id,

        name: item.product_name,
        description: item.description,

        size: item.size_name,
        color: item.color_name,
        stock: item.stock,

        // Ưu tiên giá của detail, nếu null thì lấy giá gốc
        price: item.detail_price,

        // ảnh detail nếu có, ngược lại dùng ảnh sản phẩm
        image: item.detail_image ?
            URL + item.detail_image : item.product_thumbnail ?
                URL + item.product_thumbnail : null,

        category_name: item.category_name,
    }));

    return output;
};


// 🟢 Thêm sản phẩm
export const createProduct = async (data) => {
    const { category_id, name, description, price, thumbnail, status } = data;

    const [result] = await pool.query(
        `
    INSERT INTO products (category_id, name, description, price, thumbnail, status)
    VALUES (?, ?, ?, ?, ?, ?)
    `, [category_id, name, description, price, thumbnail, status || "active"]
    );
    return { product_id: result.insertId, ...data };
};

// 🟢 Cập nhật sản phẩm
export const updateProduct = async (id, data) => {
    const { category_id, name, description, price, thumbnail, status } = data;
    await pool.query(
        `
    UPDATE products
    SET category_id = ?, name = ?, description = ?, price = ?, thumbnail = ?, status = ?
    WHERE product_id = ?
    `, [category_id, name, description, price, thumbnail, status, id]
    );
    return { product_id: id, ...data };
};

// 🟢 Xóa sản phẩm
export const deleteProduct = async (id) => {
    await pool.query("DELETE FROM products WHERE product_id = ?", [id]);
    return { message: "Product deleted successfully" };
};