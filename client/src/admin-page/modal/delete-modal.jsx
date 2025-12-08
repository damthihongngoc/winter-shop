// DeleteModal.jsx
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

export default function DeleteModal({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Bạn có chắc muốn xóa danh mục này?</DialogTitle>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button color="error" onClick={onConfirm}>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
}
