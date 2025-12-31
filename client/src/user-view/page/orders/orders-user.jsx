import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axiosInstance from "../../../authentication/axiosInstance";
import ConfirmStatusModal from "../../../admin-page/component/ConfirmStatusModal";
import OrderDetailModal from "../../../admin-page/modal/order-detail-modal";
import { jwtDecode } from "jwt-decode";
import UserAccountLayout from "../../../admin-page/component/UserAccountLayout";

const API_URL = "http://localhost:3001/api/orders";

export const ORDER_STATUS_VN = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  shipping: "Đang giao hàng",
  received: "Đã nhận hàng",
  completed: "Đã hoàn thành",
  cancelled: "Đã huỷ",
};

const STATUS_COLOR = {
  pending: "default",
  processing: "info",
  shipping: "warning",
  received: "success",
  completed: "success",
  cancelled: "error",
};

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Memoized fetch function
  const fetchOrders = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get(`${API_URL}/user/${userId}`);
      setOrders(res.data.data || res.data);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(err.response?.data?.error || "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // 🔹 Get userId from token
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        setUserId(decoded.user_id);
      } else {
        setError("Vui lòng đăng nhập để xem đơn hàng");
        setLoading(false);
      }
    } catch (err) {
      console.error("Token decode error:", err);
      setError("Phiên đăng nhập không hợp lệ");
      setLoading(false);
    }
  }, []);

  // 🔹 Fetch orders when userId changes
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 🔹 Xem chi tiết
  const handleView = async (id) => {
    try {
      const res = await axiosInstance.get(`${API_URL}/${id}`);
      setSelectedOrder(res.data.data || res.data);
      setOpenDetail(true);
    } catch (err) {
      console.error("Get order detail error:", err);
      alert(err.response?.data?.error || "Không thể xem chi tiết đơn hàng");
    }
  };

  // 🔹 User xác nhận đã nhận hàng
  const handleConfirmReceived = (orderId) => {
    setPendingOrder({
      orderId,
      newStatus: "received",
    });
    setConfirmOpen(true);
  };

  const handleUpdateStatus = async () => {
    try {
      await axiosInstance.put(`${API_URL}/${pendingOrder.orderId}/status`, {
        status: pendingOrder.newStatus,
      });
      setConfirmOpen(false);
      setPendingOrder(null);
      fetchOrders();
    } catch (err) {
      console.error("Update status error:", err);
      alert(err.response?.data?.error || "Không thể cập nhật trạng thái");
    }
  };

  // 🔹 Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 🔹 Error state
  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", my: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <UserAccountLayout title="Đơn hàng của tôi">
      {orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="h6" color="text.secondary">
            Bạn chưa có đơn hàng nào
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f7fa" }}>
              <TableRow>
                <TableCell>Người nhận</TableCell>
                <TableCell>SĐT</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Thanh toán</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày đặt</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.order_id} hover>
                  <TableCell>{o.shipping_name}</TableCell>
                  <TableCell>{o.shipping_phone}</TableCell>
                  <TableCell>
                    {Number(o.total_amount).toLocaleString()} đ
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={o.paid ? "Đã thanh toán" : "Thanh toán khi nhận"}
                      color={o.paid ? "success" : "warning"}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={
                        ORDER_STATUS_VN[o.status] || o.status_vn || o.status
                      }
                      color={STATUS_COLOR[o.status] || "default"}
                    />
                  </TableCell>

                  <TableCell>
                    {new Date(o.created_at).toLocaleDateString("vi-VN")}
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleView(o.order_id)}
                      >
                        <VisibilityIcon />
                      </IconButton>

                      {/* ✅ Chỉ hiện khi đang shipping */}
                      {o.status === "shipping" && (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleConfirmReceived(o.order_id)}
                        >
                          Đã nhận hàng
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* CONFIRM MODAL */}
      <ConfirmStatusModal
        open={confirmOpen}
        status="received"
        onClose={() => {
          setConfirmOpen(false);
          setPendingOrder(null);
        }}
        onConfirm={handleUpdateStatus}
      />

      {/* DETAIL MODAL */}
      <OrderDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        order={selectedOrder}
      />
    </UserAccountLayout>
  );
}
