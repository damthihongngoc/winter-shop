// components/admin/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaMoneyBillWave,
  FaShoppingCart,
  FaUsers,
  FaBox,
} from "react-icons/fa";

const Dashboard = () => {
  const apiUrl = import.meta.env.VITE_URL_SERVER;
  const [loading, setLoading] = useState(true);
  const [overviewStats, setOverviewStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState([]);
  const [orderStatusStats, setOrderStatusStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [revenueDays, setRevenueDays] = useState(7);

  useEffect(() => {
    fetchAllStats();
  }, [revenueDays]);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const [overview, revenue, orderStatus, products, category] =
        await Promise.all([
          axios.get(`${apiUrl}/stats/overview`, config),
          axios.get(`${apiUrl}/stats/revenue?days=${revenueDays}`, config),
          axios.get(`${apiUrl}/stats/order-status`, config),
          axios.get(`${apiUrl}/stats/top-products?limit=5`, config),
          axios.get(`${apiUrl}/stats/category`, config),
        ]);

      setOverviewStats(overview.data);
      setRevenueStats(revenue.data);
      setOrderStatusStats(orderStatus.data);
      setTopProducts(products.data);
      setCategoryStats(category.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
  ];

  const statusColors = {
    pending: "#FFA726",
    processing: "#42A5F5",
    shipping: "#66BB6A",
    received: "#26A69A",
    completed: "#4CAF50",
    cancelled: "#EF5350",
  };

  const statusLabels = {
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    shipping: "Đang giao",
    received: "Đã nhận",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div style={{ padding: "0" }}>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: 600,
          marginBottom: "24px",
          color: "#333",
        }}
      >
        Trang chủ
      </h1>

      {/* Overview Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <StatCard
          icon={<FaMoneyBillWave />}
          title="Tổng doanh thu"
          value={formatCurrency(overviewStats?.total_revenue || 0)}
          subtitle={`Hôm nay: ${formatCurrency(
            overviewStats?.today_revenue || 0
          )}`}
          color="#4CAF50"
        />
        <StatCard
          icon={<FaShoppingCart />}
          title="Tổng đơn hàng"
          value={overviewStats?.total_orders || 0}
          subtitle={`Hôm nay: ${overviewStats?.today_orders || 0}`}
          color="#2196F3"
        />
        <StatCard
          icon={<FaUsers />}
          title="Người dùng"
          value={overviewStats?.total_users || 0}
          subtitle="Khách hàng"
          color="#FF9800"
        />
        <StatCard
          icon={<FaBox />}
          title="Sản phẩm"
          value={overviewStats?.total_products || 0}
          subtitle="Đang còn hàng"
          color="#9C27B0"
        />
      </div>

      {/* Revenue Chart */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "30px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#333" }}>
            Doanh thu theo ngày
          </h2>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setRevenueDays(7)}
              style={{
                padding: "8px 16px",
                border:
                  revenueDays === 7 ? "2px solid #2196F3" : "1px solid #ddd",
                background: revenueDays === 7 ? "#E3F2FD" : "#fff",
                borderRadius: "6px",
                cursor: "pointer",
                color: revenueDays === 7 ? "#2196F3" : "#666",
                fontWeight: revenueDays === 7 ? 600 : 400,
              }}
            >
              7 ngày
            </button>
            <button
              onClick={() => setRevenueDays(30)}
              style={{
                padding: "8px 16px",
                border:
                  revenueDays === 30 ? "2px solid #2196F3" : "1px solid #ddd",
                background: revenueDays === 30 ? "#E3F2FD" : "#fff",
                borderRadius: "6px",
                cursor: "pointer",
                color: revenueDays === 30 ? "#2196F3" : "#666",
                fontWeight: revenueDays === 30 ? 600 : 400,
              }}
            >
              30 ngày
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              labelFormatter={(label) => `Ngày: ${formatDate(label)}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2196F3"
              strokeWidth={2}
              name="Doanh thu"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* Order Status */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              marginBottom: "20px",
              color: "#333",
            }}
          >
            Trạng thái đơn hàng
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusStats}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) =>
                  `${statusLabels[entry.status]}: ${entry.count}`
                }
              >
                {orderStatusStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={statusColors[entry.status]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [value, statusLabels[name]]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Stats */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              marginBottom: "20px",
              color: "#333",
            }}
          >
            Doanh thu theo danh mục
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="total_revenue" fill="#4CAF50" name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "20px",
            color: "#333",
          }}
        >
          Top sản phẩm bán chạy
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
                <th style={{ padding: "12px", fontWeight: 600 }}>Sản phẩm</th>
                <th style={{ padding: "12px", fontWeight: 600 }}>Số đơn</th>
                <th style={{ padding: "12px", fontWeight: 600 }}>Đã bán</th>
                <th style={{ padding: "12px", fontWeight: 600 }}>Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr
                  key={product.product_id}
                  style={{
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <td style={{ padding: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          background: COLORS[index % COLORS.length],
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      >
                        #{index + 1}
                      </div>
                      <span style={{ fontWeight: 500 }}>{product.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px" }}>{product.order_count}</td>
                  <td style={{ padding: "12px" }}>{product.total_quantity}</td>
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: 600,
                      color: "#4CAF50",
                    }}
                  >
                    {formatCurrency(product.total_revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, subtitle, color }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "12px",
          background: `${color}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
          fontSize: "24px",
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>
          {title}
        </div>
        <div
          style={{
            fontSize: "24px",
            fontWeight: 600,
            color: "#333",
            marginBottom: "4px",
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: "12px", color: "#999" }}>{subtitle}</div>
      </div>
    </div>
  );
};

export default Dashboard;
