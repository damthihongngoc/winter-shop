import pool from "../config/db.js";
const URL = `http://localhost:` + process.env.PORT + ``; // hoặc lấy từ config/env

// Format product detail
const formatProductDetail = (detail) => ({
    detail_id: detail.detail_id,
    product_id: detail.product_id,
    price: detail.price,
    stock: detail.stock,
    image: detail.image ? URL + detail.image : null,
    size: detail.size_name,
    color: detail.color_name,
    hexCode: detail.color_hex
});

// 🟢 Lấy tất cả sản phẩm với bộ lọc VÀ PHÂN TRANG
export const getProducts = async (req, res) => {
    try {
        const {
            category_id,
            min_price,
            max_price,
            colors,
            sizes,
            sort = "newest",
            page = 1,
            limit = 12,
        } = req.query;

        const result = await getAllProducts({
            categoryId: category_id,
            minPrice: min_price,
            maxPrice: max_price,
            colors: colors ? colors.split(",") : null,
            sizes: sizes ? sizes.split(",") : null,
            sortBy: sort,
            page: parseInt(page),
            limit: parseInt(limit),
        });

        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching products", error });
    }
};

// 🟢 Main function: Lấy products với filters VÀ PAGINATION (FIXED)
export const getAllProducts = async (filters = {}) => {
    const {
        categoryId,
        minPrice,
        maxPrice,
        colors,
        sizes,
        sortBy = "newest",
        page = 1,
        limit = 12,
    } = filters;

    // ========== BUILD FILTER CONDITIONS ==========
    let filterConditions = [];
    let filterParams = [];

    if (categoryId) {
        filterConditions.push("p.category_id = ?");
        filterParams.push(categoryId);
    }

    // Price/Color/Size filters - sử dụng subquery để tránh duplicate
    let hasDetailFilters = false;
    let detailFilterQuery = "";

    if (minPrice || maxPrice || colors || sizes) {
        hasDetailFilters = true;
        let detailConditions = [];

        if (minPrice) {
            detailConditions.push("pd.price >= ?");
            filterParams.push(minPrice);
        }

        if (maxPrice) {
            detailConditions.push("pd.price <= ?");
            filterParams.push(maxPrice);
        }

        if (colors && colors.length > 0) {
            detailConditions.push(`col.name IN (${colors.map(() => "?").join(",")})`);
            filterParams.push(...colors);
        }

        if (sizes && sizes.length > 0) {
            detailConditions.push(`sz.name IN (${sizes.map(() => "?").join(",")})`);
            filterParams.push(...sizes);
        }

        // Build EXISTS subquery
        detailFilterQuery = `
        EXISTS (
            SELECT 1
            FROM product_details pd
            ${colors && colors.length > 0 ? "JOIN colors col ON pd.color_id = col.color_id" : ""}
            ${sizes && sizes.length > 0 ? "JOIN sizes sz ON pd.size_id = sz.size_id" : ""}
            WHERE pd.product_id = p.product_id
            ${detailConditions.length > 0 ? "AND " + detailConditions.join(" AND ") : ""}
        )
        `;
        filterConditions.push(detailFilterQuery);
    }

    // ========== STEP 1: COUNT TOTAL PRODUCTS ==========
    let countQuery = `
        SELECT COUNT(*) as total
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        ${filterConditions.length > 0 ? "WHERE " + filterConditions.join(" AND ") : ""}
    `;

    const [countResult] = await pool.query(countQuery, filterParams);
    const totalProducts = countResult[0].total;
    const totalPages = Math.ceil(totalProducts / limit);

    // ========== STEP 2: GET PRODUCTS WITH PAGINATION ==========
    // Sort order
    let orderBy;
    switch (sortBy) {
        case "price_asc":
            orderBy = "p.price ASC";
            break;
        case "price_desc":
            orderBy = "p.price DESC";
            break;
        case "name_asc":
            orderBy = "p.name ASC";
            break;
        case "name_desc":
            orderBy = "p.name DESC";
            break;
        case "newest":
        default:
            orderBy = "p.created_at DESC";
            break;
    }

    const offset = (page - 1) * limit;

    let productsQuery = `
        SELECT p.*, c.name AS category_name
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        ${filterConditions.length > 0 ? "WHERE " + filterConditions.join(" AND ") : ""}
        ORDER BY ${orderBy}
        LIMIT ? OFFSET ?
    `;

    const productsParams = [...filterParams, limit, offset];
    const [products] = await pool.query(productsQuery, productsParams);

    if (products.length === 0) {
        return {
            products: [],
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalProducts: totalProducts,
                itemsPerPage: limit,
            },
        };
    }

    // ========== STEP 3: GET PRODUCT DETAILS ==========
    const productIds = products.map((p) => p.product_id);
    const [details] = await pool.query(
        `
            SELECT
            pd.detail_id,
            pd.product_id,
            pd.price,
            pd.stock,
            pd.image,
            s.name AS size_name,
            c.name AS color_name
            FROM product_details pd
            JOIN sizes s ON pd.size_id = s.size_id
            JOIN colors c ON pd.color_id = c.color_id
            WHERE pd.product_id IN (?)
            ORDER BY pd.product_id, s.name, c.name
        `,
        [productIds]
    );

    // Group details by product_id
    const detailMap = {};
    details.forEach((d) => {
        if (!detailMap[d.product_id]) detailMap[d.product_id] = [];
        detailMap[d.product_id].push(formatProductDetail(d));
    });

    // Attach details to products
    const productsWithDetails = products.map((p) => ({
        ...p,
        thumbnail: p.thumbnail ? URL + p.thumbnail : null,
        details: detailMap[p.product_id] || [],
    }));

    console.log('Filter params:', filters);
    console.log('Total products:', totalProducts);
    console.log('Current page:', page);
    console.log('Products returned:', products.length);

    // ========== RETURN WITH PAGINATION INFO ==========
    return {
        products: productsWithDetails,
        pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalProducts: totalProducts,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
};

// 🟢 Lấy sản phẩm theo ID
export const getProductById = async (id) => {
    // 1. Product
    const [products] = await pool.query(`
        SELECT p.*, c.name AS category_name
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        WHERE p.product_id = ?
    `, [id]);

    if (!products[0]) return null;

    // 2. Details
    const [details] = await pool.query(`
        SELECT
            pd.detail_id,
            pd.price,
            pd.stock,
            pd.image,
            s.name AS size_name,
            c.name AS color_name,
            c.hex_code AS color_hex
        FROM product_details pd
        JOIN sizes s ON pd.size_id = s.size_id
        JOIN colors c ON pd.color_id = c.color_id
        WHERE pd.product_id = ?
    `, [id]);

    return {
        ...products[0],
        thumbnail: products[0].thumbnail ? URL + products[0].thumbnail : null,
        details: details.map(formatProductDetail)
    };
};

export const getProductByCategoryID = async (categoryId) => {
    const products = await getAllProductsWithFilters({
        categoryId: parseInt(categoryId),
    });

    return products
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