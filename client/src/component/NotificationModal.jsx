import React, { useEffect } from "react";
import "./style/notificationModal.css";

const NotificationModal = ({
  isOpen,
  onClose,
  type = "neutral",
  message = "Thông báo",
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500); // Tự đóng sau 2.5 giây

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  console.log("NotificationModal render", { isOpen, type, message });
  if (!isOpen) return <></>;

  return (
    <div className="notify-backdrop" onClick={onClose}>
      <div
        className={`notify-modal notify-${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <p>{message}</p>
        <button className="notify-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
