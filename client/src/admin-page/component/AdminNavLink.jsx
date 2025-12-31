// components/admin/AdminNavLink.jsx
import { Link, useLocation } from "react-router-dom";

const AdminNavLink = ({ path, label, icon }) => {
  const { pathname } = useLocation();
  const isActive = pathname === path;

  return (
    <Link
      to={path}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 20px",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: 500,
        color: isActive ? "#2196f3" : "#555",
        background: isActive ? "#e3f2fd" : "transparent",
        borderLeft: isActive ? "4px solid #2196f3" : "4px solid transparent",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = "#f1f1f1";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = "transparent";
      }}
    >
      <span style={{ fontSize: "16px", display: "flex" }}>{icon}</span>
      {label}
    </Link>
  );
};

export default AdminNavLink;
