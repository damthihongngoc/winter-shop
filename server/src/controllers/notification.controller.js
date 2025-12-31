// controllers/notification.controller.js
import * as NotificationService from "../services/notification.service.js";

export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { page = 1, limit = 20 } = req.query;

        const result = await NotificationService.getUserNotifications(userId, {
            page: parseInt(page),
            limit: parseInt(limit),
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const count = await NotificationService.getUnreadCount(userId);
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const notificationId = req.params.id;

        await NotificationService.markAsRead(notificationId, userId);
        res.json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.user_id;
        await NotificationService.markAllAsRead(userId);
        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const notificationId = req.params.id;

        await NotificationService.deleteNotification(notificationId, userId);
        res.json({ message: "Notification deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};