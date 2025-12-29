import { useEffect, useState } from "react";
import axios from "axios";

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
  Select,
  MenuItem,
  Chip,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";

import OrderDetailModal from "../../modal/order-detail-modal";
import ConfirmStatusModal from "../../component/ConfirmStatusModal";
import axiosInstance from "../../../authentication/axiosInstance";

const API_URL = "http://localhost:3001/api/orders";

export const ORDER_STATUS_VN = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  shipping: "Đang giao hàng",
  received: "Đã nhận hàng",
  completed: "Đã hoàn thành",
  cancelled: "Đã huỷ",
};
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  // pendingStatus = { orderId, newStatus }

  // 🔹 GET all orders
  const fetchOrders = async () => {
    const res = await axiosInstance.get(API_URL);
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔹 View order detail
  const handleView = async (id) => {
    const res = await axiosInstance.get(`${API_URL}/${id}`);
    setSelectedOrder(res.data);
    setOpenDetail(true);
  };

  // 🔹 Update status
  const handleStatusChange = async (id, status) => {
    await axiosInstance.put(`${API_URL}/${id}/status`, { status });
    fetchOrders();
  };

  const ORDER_STATUS_FLOW = [
    "pending",
    "processing",
    "shipping",
    "received",
    "completed",
  ];

  return (
    <Box sx={{ maxWidth: 1400, margin: "40px auto" }}>
      <Typography variant="h4" mb={3}>
        Quản lý đơn hàng
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ background: "#f3f3f3" }}>
            <TableRow>
              <TableCell>Tên tài khoản</TableCell>{" "}
              <TableCell>Tên người mua</TableCell>{" "}
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Phương thức</TableCell>{" "}
              <TableCell>Thanh toán</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((o) => {
              const currentIndex = ORDER_STATUS_FLOW.indexOf(o.status);
              console.log("orders", orders);
              return (
                <TableRow key={o.order_id}>
                  {" "}
                  <TableCell>{o.user_name}</TableCell>{" "}
                  <TableCell>{o?.shipping_name}</TableCell>
                  <TableCell>{o.shipping_phone}</TableCell>
                  <TableCell>
                    {Number(o.total_amount).toLocaleString()} đ
                  </TableCell>
                  <TableCell>{o.payment_method_vn}</TableCell>
                  <TableCell>
                    {o.paid ? (
                      <Chip
                        label="Đã thanh toán"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip
                        label="Chưa thanh toán"
                        color="warning"
                        size="small"
                      />
                    )}
                  </TableCell>
                  {/* STATUS */}
                  <TableCell>
                    <Select
                      size="small"
                      value={o.status}
                      onChange={(e) =>
                        setPendingStatus({
                          orderId: o.order_id,
                          newStatus: e.target.value,
                        }) || setConfirmOpen(true)
                      }
                      disabled={["completed", "cancelled"].includes(o.status)}
                    >
                      {Object.entries(ORDER_STATUS_VN).map(([key, label]) => {
                        const nextIndex = ORDER_STATUS_FLOW.indexOf(key);

                        // ❌ Không cho quay lui
                        const isBackward =
                          nextIndex !== -1 && nextIndex < currentIndex;

                        // ❌ cancelled chỉ cho khi chưa shipping
                        const isCancelDisabled =
                          key === "cancelled" &&
                          !["pending", "processing"].includes(o.status);

                        return (
                          <MenuItem
                            key={key}
                            value={key}
                            disabled={isBackward || isCancelDisabled}
                          >
                            {label}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </TableCell>
                  <TableCell>
                    {new Date(o.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleView(o.order_id)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmStatusModal
        open={confirmOpen}
        status={pendingStatus?.newStatus}
        onClose={() => {
          setConfirmOpen(false);
          setPendingStatus(null);
        }}
        onConfirm={async () => {
          await handleStatusChange(
            pendingStatus.orderId,
            pendingStatus.newStatus
          );
          setConfirmOpen(false);
          setPendingStatus(null);
        }}
      />

      <OrderDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        order={selectedOrder}
      />
    </Box>
  );
}
