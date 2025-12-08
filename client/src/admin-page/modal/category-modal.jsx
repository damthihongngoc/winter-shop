// CategoryFormModal.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

export default function CategoryFormModal({
  open,
  form,
  setForm,
  onClose,
  onSubmit,
  editingId,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {editingId ? "Cập nhật danh mục" : "Thêm danh mục mới"}
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <TextField
          fullWidth
          label="Tên danh mục"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Mô tả"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={onSubmit}>
          {editingId ? "Cập nhật" : "Thêm mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
