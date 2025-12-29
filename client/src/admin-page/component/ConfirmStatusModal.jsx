import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { ORDER_STATUS_VN } from "../page/orders-page/page";

export default function ConfirmStatusModal({
  open,
  onClose,
  onConfirm,
  status,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>

      <DialogContent>
        <Typography>
          Bạn có chắc muốn đổi trạng thái đơn hàng sang{" "}
          <b>{ORDER_STATUS_VN[status]}</b> không?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button variant="contained" color="primary" onClick={onConfirm}>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}
