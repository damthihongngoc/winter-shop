// components/admin/AdminSidebar.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaChartBar,
  FaBox,
  FaShoppingCart,
  FaPalette,
  FaRulerCombined,
  FaUsers,
  FaReceipt,
  FaInfoCircle,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import AdminNavLink from "./AdminNavLink";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const apiUrl = import.meta.env.VITE_URL_SERVER;

  /* =====================
     VERIFY ADMIN + PROFILE
     ===================== */
  useEffect(() => {
    const token = localStorage.getItem("token");

    const verify = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`${apiUrl}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.data.isAdmin) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setUserInfo(res.data.user);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    verify();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside
      style={{
        width: "240px",
        background: "#fff",
        borderRight: "1px solid #e0e0e0",
        height: "100vh",
        position: "fixed",
        top: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #e0e0e0",
          fontWeight: 600,
          fontSize: "18px",
          color: "#333",
          textAlign: "center",
        }}
      >
        Quản lý hệ thống
      </div>

      {/* ===== MENU ===== */}
      <nav style={{ flex: 1, padding: "12px 0" }}>
        <AdminNavLink path="/admin" label="Trang chủ" icon={<FaChartBar />} />
        <AdminNavLink path="/admin/banner" label="Banner" icon={<FaBox />} />
        <AdminNavLink
          path="/admin/category"
          label="Danh mục"
          icon={<FaBox />}
        />
        <AdminNavLink
          path="/admin/product"
          label="Sản phẩm"
          icon={<FaShoppingCart />}
        />
        <AdminNavLink
          path="/admin/product-detail"
          label="Chi tiết sản phẩm"
          icon={<FaInfoCircle />}
        />
        <AdminNavLink
          path="/admin/colors"
          label="Màu sắc"
          icon={<FaPalette />}
        />
        <AdminNavLink
          path="/admin/sizes"
          label="Kích cỡ"
          icon={<FaRulerCombined />}
        />
        <AdminNavLink
          path="/admin/orders"
          label="Đơn hàng"
          icon={<FaReceipt />}
        />
        <AdminNavLink
          path="/admin/users"
          label="Người dùng"
          icon={<FaUsers />}
        />
      </nav>

      {/* ===== PROFILE ===== */}
      {userInfo && (
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#666",
              marginBottom: "12px",
            }}
          >
            <div style={{ fontWeight: 600, color: "#333" }}>
              {userInfo.name || "Admin"}
            </div>
            <div style={{ fontSize: "12px" }}>{userInfo.email}</div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;
