import pool from "../config/db.js";

// Thống kê tổng quan
export const getOverviewStats = async () => {
    // Tổng doanh thu
    const [revenueResult] = await pool.query(
        "SELECT COALESCE(SUM(total_amount), 0) as total_revenue FROM orders WHERE status != 'cancelled'"
    );

    // Tổng đơn hàng
    const [ordersResult] = await pool.query(
        "SELECT COUNT(*) as total_orders FROM orders"
    );

    // Tổng người dùng
    const [usersResult] = await pool.query(
        "SELECT COUNT(*) as total_users FROM users WHERE role = 'user'"
    );

    // Tổng sản phẩm
    const [productsResult] = await pool.query(
        "SELECT COUNT(*) as total_products FROM products WHERE status = 'active'"
    );

    // Đơn hàng hôm nay
    const [todayOrdersResult] = await pool.query(
        "SELECT COUNT(*) as today_orders FROM orders WHERE DATE(created_at) = CURDATE()"
    );

    // Doanh thu hôm nay
    const [todayRevenueResult] = await pool.query(
        "SELECT COALESCE(SUM(total_amount), 0) as today_revenue FROM orders WHERE DATE(created_at) = CURDATE() AND status != 'cancelled'"
    );

    return {
        total_revenue: parseFloat(revenueResult[0].total_revenue),
        total_orders: ordersResult[0].total_orders,
        total_users: usersResult[0].total_users,
        total_products: productsResult[0].total_products,
        today_orders: todayOrdersResult[0].today_orders,
        today_revenue: parseFloat(todayRevenueResult[0].today_revenue),
    };
};

// Thống kê doanh thu theo ngày
export const getRevenueStats = async (days = 7) => {
    const [rows] = await pool.query(
        `SELECT 
            DATE(created_at) as date,
            COALESCE(SUM(total_amount), 0) as revenue,
            COUNT(*) as order_count
        FROM orders 
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            AND status != 'cancelled'
        GROUP BY DATE(created_at)
        ORDER BY date ASC`,
        [days]
    );

    return rows.map(row => ({
        date: row.date,
        revenue: parseFloat(row.revenue),
        order_count: row.order_count,
    }));
};

// Thống kê đơn hàng theo trạng thái
export const getOrderStatusStats = async () => {
    const [rows] = await pool.query(
        `SELECT 
            status,
            COUNT(*) as count,
            COALESCE(SUM(total_amount), 0) as total_amount
        FROM orders
        GROUP BY status
        ORDER BY count DESC`
    );

    return rows.map(row => ({
        status: row.status,
        count: row.count,
        total_amount: parseFloat(row.total_amount),
    }));
};

// Top sản phẩm bán chạy
export const getTopProducts = async (limit = 5) => {
    const [rows] = await pool.query(
        `SELECT 
            p.product_id,
            p.name,
            p.thumbnail,
            COUNT(od.order_detail_id) as order_count,
            SUM(od.quantity) as total_quantity,
            SUM(od.quantity * od.price) as total_revenue
        FROM products p
        INNER JOIN product_details pd ON p.product_id = pd.product_id
        INNER JOIN order_details od ON pd.detail_id = od.detail_id
        INNER JOIN orders o ON od.order_id = o.order_id
        WHERE o.status != 'cancelled'
        GROUP BY p.product_id, p.name, p.thumbnail
        ORDER BY total_revenue DESC
        LIMIT ?`,
        [limit]
    );

    return rows.map(row => ({
        product_id: row.product_id,
        name: row.name,
        thumbnail: row.thumbnail,
        order_count: row.order_count,
        total_quantity: row.total_quantity,
        total_revenue: parseFloat(row.total_revenue),
    }));
};

// Thống kê theo danh mục
export const getCategoryStats = async () => {
    const [rows] = await pool.query(
        `SELECT 
            c.category_id,
            c.name,
            COUNT(DISTINCT od.order_detail_id) as order_count,
            SUM(od.quantity) as total_quantity,
            SUM(od.quantity * od.price) as total_revenue
        FROM categories c
        INNER JOIN products p ON c.category_id = p.category_id
        INNER JOIN product_details pd ON p.product_id = pd.product_id
        INNER JOIN order_details od ON pd.detail_id = od.detail_id
        INNER JOIN orders o ON od.order_id = o.order_id
        WHERE o.status != 'cancelled'
        GROUP BY c.category_id, c.name
        ORDER BY total_revenue DESC`
    );

    return rows.map(row => ({
        category_id: row.category_id,
        name: row.name,
        order_count: row.order_count,
        total_quantity: row.total_quantity,
        total_revenue: parseFloat(row.total_revenue),
    }));
};