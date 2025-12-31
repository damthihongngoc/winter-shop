import { useNotification } from "../contexts/NotificationContext";
import { FaBell, FaTrash, FaCheckDouble } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { HiBellAlert } from "react-icons/hi2";

const NotificationButton = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotification();

  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowPanel(false);
      }
    };

    if (showPanel) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPanel]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;

    return date.toLocaleDateString("vi-VN");
  };

  const handleNotificationClick = (notification) => {
    if (notification.status === "unread") {
      markAsRead(notification.notification_id);
    }
  };

  return (
    <div ref={panelRef} style={{ position: "relative" }}>
      {/* Floating Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "rgba(30, 64, 175, 0.8)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.25)",
          color: "#fff",
          cursor: "pointer",
          boxShadow: "0 10px 30px rgba(30,64,175,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          transition: "all 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <HiBellAlert size={26} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              background: "#ef4444",
              color: "#fff",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 600,
              border: "2px solid #fff",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {showPanel && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "30px",
            width: "420px",
            maxHeight: "600px",
            background: "#fff",
            borderRadius: "18px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
            zIndex: 1001,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: "18px" }}>Thông báo</h3>
              {unreadCount > 0 && (
                <p
                  style={{ margin: "4px 0 0", fontSize: "13px", opacity: 0.9 }}
                >
                  {unreadCount} chưa đọc
                </p>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: "rgba(255,255,255,0.25)",
                  border: "none",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FaCheckDouble /> Đọc tất cả
              </button>
            )}
          </div>

          {/* Notifications List – NEW UI */}
          <div
            style={{
              flex: 1,
              padding: "12px",
              overflowY: "auto",
              background: "#f4f6fb",
            }}
          >
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: "60px 20px",
                  textAlign: "center",
                  color: "#999",
                }}
              >
                <FaBell size={46} style={{ opacity: 0.3 }} />
                <p style={{ marginTop: "16px" }}>Không có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.notification_id}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    background: "#fff",
                    borderRadius: "14px",
                    padding: "14px 16px",
                    marginBottom: "10px",
                    cursor: "pointer",
                    position: "relative",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                    borderLeft:
                      notification.status === "unread"
                        ? "4px solid #667eea"
                        : "4px solid transparent",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 24px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 18px rgba(0,0,0,0.06)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#1f2937",
                        }}
                      >
                        {notification.title}
                      </h4>

                      <p
                        style={{
                          margin: "6px 0 10px",
                          fontSize: "13px",
                          color: "#4b5563",
                          lineHeight: 1.5,
                        }}
                      >
                        {notification.message}
                      </p>

                      <span
                        style={{
                          fontSize: "12px",
                          color: "#9ca3af",
                        }}
                      >
                        {formatTime(notification.created_at)}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.notification_id);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#9ca3af",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                      title="Xóa"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
