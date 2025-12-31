import { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";
import axios from "axios";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const apiUrl = import.meta.env.VITE_URL_SERVER;

  // Fetch initial notifications và unread count
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  // Lắng nghe notification từ socket
  useEffect(() => {
    if (!socket) return;

    socket.on("notification", (notification) => {
      console.log("New notification:", notification);

      // Thêm notification mới vào đầu danh sách
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Hiển thị toast notification (tùy chọn)
      showToast(notification);
    });

    return () => {
      socket.off("notification");
    };
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 1, limit: 50 },
      });
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${apiUrl}/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notificationId ? { ...n, status: "read" } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${apiUrl}/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, status: "read" })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const notification = notifications.find(
        (n) => n.notification_id === notificationId
      );
      if (notification?.status === "unread") {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      setNotifications((prev) =>
        prev.filter((n) => n.notification_id !== notificationId)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const showToast = (notification) => {
    // Implement toast notification nếu muốn
    // Có thể dùng react-toastify hoặc tự implement
    console.log("Toast:", notification.title, notification.message);
  };

  const toggleNotificationPanel = () => {
    setShowNotificationPanel((prev) => !prev);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        showNotificationPanel,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        toggleNotificationPanel,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
