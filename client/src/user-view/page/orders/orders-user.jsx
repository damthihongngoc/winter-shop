import { useEffect, useState } from "react";
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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axiosInstance from "../../../authentication/axiosInstance";
import ConfirmStatusModal from "../../../admin-page/component/ConfirmStatusModal";
import OrderDetailModal from "../../../admin-page/modal/order-detail-modal";
import { jwtDecode } from "jwt-decode";

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
  // pendingOrder = { orderId, newStatus }

  // 🔹 GET orders của user
  const fetchOrders = async () => {
    const res = await axiosInstance.get(`${API_URL}/user/${userId}`);
    setOrders(res.data);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.user_id);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  // 🔹 Xem chi tiết
  const handleView = async (id) => {
    const res = await axiosInstance.get(`${API_URL}/${id}`);
    setSelectedOrder(res.data);
    setOpenDetail(true);
  };

  // 🔹 Update status (user chỉ được received)
  const handleConfirmReceived = (orderId) => {
    setPendingOrder({
      orderId,
      newStatus: "received",
    });
    setConfirmOpen(true);
  };

  const handleUpdateStatus = async () => {
    await axiosInstance.put(`${API_URL}/${pendingOrder.orderId}/status`, {
      status: pendingOrder.newStatus,
    });
    setConfirmOpen(false);
    setPendingOrder(null);
    fetchOrders();
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", my: 5 }}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Đơn hàng của tôi
      </Typography>

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
                    label={o.status_vn}
                    color={STATUS_COLOR[o.status]}
                  />
                </TableCell>

                <TableCell>
                  {new Date(o.created_at).toLocaleDateString()}
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
    </Box>
  );
}
