// services/notification.service.js
import pool from "../config/db.js";
import { notifyUser, notifyAdmins } from "../config/socket.js";

// Tạo thông báo và gửi qua socket
export const createNotification = async (userId, title, message, data = null) => {
    const [result] = await pool.query(
        "INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)",
        [userId, title, message]
    );

    const notification = {
        notification_id: result.insertId,
        user_id: userId,
        title,
        message,
        status: "unread",
        created_at: new Date(),
        data, // Thêm data nếu cần (order_id, etc.)
    };

    // Gửi thông báo qua socket
    notifyUser(userId, notification);

    return notification;
};

// Tạo thông báo cho tất cả admin
export const createAdminNotification = async (title, message, data = null) => {
    // Lấy danh sách admin
    const [admins] = await pool.query(
        "SELECT user_id FROM users WHERE role = 'admin'"
    );

    const notifications = [];

    for (const admin of admins) {
        const [result] = await pool.query(
            "INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)",
            [admin.user_id, title, message]
        );

        notifications.push({
            notification_id: result.insertId,
            user_id: admin.user_id,
            title,
            message,
            status: "unread",
            created_at: new Date(),
            data,
        });
    }

    // Gửi thông báo cho tất cả admin qua socket
    const notification = {
        title,
        message,
        status: "unread",
        created_at: new Date(),
        data,
    };
    notifyAdmins(notification);

    return notifications;
};

// Lấy thông báo của user
export const getUserNotifications = async (userId, options = {}) => {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    const [countResult] = await pool.query(
        "SELECT COUNT(*) as total FROM notifications WHERE user_id = ?",
        [userId]
    );
    const totalNotifications = countResult[0].total;
    const totalPages = Math.ceil(totalNotifications / limit);

    const [rows] = await pool.query(
        `SELECT * FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?`,
        [userId, limit, offset]
    );

    return {
        notifications: rows,
        pagination: {
            currentPage: page,
            totalPages,
            totalNotifications,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
};

// Đếm số thông báo chưa đọc
export const getUnreadCount = async (userId) => {
    const [rows] = await pool.query(
        "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND status = 'unread'",
        [userId]
    );
    return rows[0].count;
};

// Đánh dấu đã đọc
export const markAsRead = async (notificationId, userId) => {
    await pool.query(
        "UPDATE notifications SET status = 'read' WHERE notification_id = ? AND user_id = ?",
        [notificationId, userId]
    );
};

// Đánh dấu tất cả đã đọc
export const markAllAsRead = async (userId) => {
    await pool.query(
        "UPDATE notifications SET status = 'read' WHERE user_id = ? AND status = 'unread'",
        [userId]
    );
};

// Xóa thông báo
export const deleteNotification = async (notificationId, userId) => {
    await pool.query(
        "DELETE FROM notifications WHERE notification_id = ? AND user_id = ?",
        [notificationId, userId]
    );
};