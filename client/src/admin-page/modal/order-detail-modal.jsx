import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";

const PRIMARY_COLOR = "#8aad51";

export default function OrderDetailModal({ open, onClose, order }) {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      {/* Header */}
      <DialogTitle
        sx={{
          backgroundColor: PRIMARY_COLOR,
          color: "#fff",
          fontWeight: 600,
        }}
      >
        Chi tiết đơn hàng #{order.order_id}
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "2fr 1fr",
            },
            gap: 2,
            mb: 3,
          }}
        >
          {/* Thông tin người dùng */}
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography fontWeight={700} mb={1} color="#8aad51">
              Thông tin người nhận
            </Typography>

            <Typography>
              <b>Tên:</b> {order.shipping_name}
            </Typography>
            <Typography>
              <b>Số điện thoại:</b> {order.shipping_phone}
            </Typography>
            <Typography>
              <b>Email:</b> {order.user_user_email || order.user_email}
            </Typography>
            <Typography>
              <b>Địa chỉ:</b> {order.shipping_address}
            </Typography>
          </Box>

          {/* Thanh toán & trạng thái */}
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography fontWeight={700} mb={1} color="#8aad51">
              Đơn hàng
            </Typography>

            <Typography>
              <b>Thanh toán:</b> {order.payment_method_vn?.toUpperCase()}
            </Typography>

            <Typography>
              <b>Trạng thái:</b>{" "}
              <Box
                component="span"
                sx={{
                  color: PRIMARY_COLOR,
                  fontWeight: 600,
                }}
              >
                {order.status_vn}
              </Box>
            </Typography>
          </Box>

          {/* Tổng tiền */}
          <Box
            sx={{
              gridColumn: { md: "1 / -1" },
              backgroundColor: "#f4f7f1",
              borderRadius: 2,
              p: 2,
              textAlign: "right",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Tổng thanh toán
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: PRIMARY_COLOR, fontWeight: 700 }}
            >
              {Number(order.total_amount).toLocaleString()} đ
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Bảng sản phẩm */}
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f4f7f1" }}>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Kích cỡ</TableCell>
              <TableCell>Màu</TableCell>
              <TableCell align="center">Số lượng</TableCell>
              <TableCell align="right">Giá</TableCell>
              <TableCell align="right">Thành tiền</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {order.items.map((i) => (
              <TableRow key={i.order_detail_id} hover>
                {/* Sản phẩm */}
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      variant="rounded"
                      src={i.image}
                      sx={{ width: 56, height: 56 }}
                    />
                    <Box>
                      <Typography fontWeight={500}>{i.product_name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {i.product_id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                {/* Size */}
                <TableCell>
                  <Chip label={i.size} size="small" />
                </TableCell>

                {/* Màu */}
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        backgroundColor: i.hex_code,
                        border: "1px solid #ccc",
                      }}
                    />
                    <Typography variant="body2">{i.color}</Typography>
                  </Box>
                </TableCell>

                {/* Số lượng */}
                <TableCell align="center">{i.quantity}</TableCell>

                {/* Giá */}
                <TableCell align="right">
                  {Number(i.price).toLocaleString()} đ
                </TableCell>

                {/* Thành tiền */}
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, color: PRIMARY_COLOR }}
                >
                  {(i.price * i.quantity).toLocaleString()} đ
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
