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
  Select,
  MenuItem,
  Chip,
  Pagination,
  Stack,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";

import OrderDetailModal from "../../modal/order-detail-modal";
import ConfirmStatusModal from "../../component/ConfirmStatusModal";
import axiosInstance from "../../../authentication/axiosInstance";
import PageLayout from "../../component/PageLayout";

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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [itemsPerPage] = useState(10);

  // 🔹 GET all orders with pagination
  const fetchOrders = async (page = 1) => {
    try {
      const res = await axiosInstance.get(API_URL, {
        params: {
          page: page,
          limit: itemsPerPage,
        },
      });

      console.log("Fetched orders:", res);
      setOrders(res.data.data);

      // Cập nhật thông tin phân trang
      if (res.data.pagination) {
        setCurrentPage(res.data.pagination.currentPage);
        setTotalPages(res.data.pagination.totalPages);
        setTotalOrders(res.data.pagination.totalOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // 🔹 View order detail
  const handleView = async (id) => {
    try {
      const res = await axiosInstance.get(`${API_URL}/${id}`);
      console.log("Order detail:", res);
      setSelectedOrder(res.data.data);
      setOpenDetail(true);
    } catch (error) {
      console.error("Error fetching order detail:", error);
    }
  };

  // 🔹 Update status
  const handleStatusChange = async (id, status) => {
    try {
      await axiosInstance.put(`${API_URL}/${id}/status`, { status });
      fetchOrders(currentPage);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

  const ORDER_STATUS_FLOW = [
    "pending",
    "processing",
    "shipping",
    "received",
    "completed",
  ];

  return (
    <PageLayout title="Quản lý đơn hàng">
      {/* Hiển thị thông tin phân trang */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Hiển thị{" "}
          {orders.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{" "}
          {Math.min(currentPage * itemsPerPage, totalOrders)} của {totalOrders}{" "}
          đơn hàng
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ background: "#f3f3f3" }}>
            <TableRow>
              <TableCell>Tên tài khoản</TableCell>
              <TableCell>Tên người mua</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Phương thức</TableCell>
              <TableCell>Thanh toán</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 3 }}
                  >
                    Không có đơn hàng nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((o) => {
                const currentIndex = ORDER_STATUS_FLOW.indexOf(o.status);
                return (
                  <TableRow key={o.order_id}>
                    <TableCell>{o.user_name}</TableCell>
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
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Stack>
      )}

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
    </PageLayout>
  );
}
