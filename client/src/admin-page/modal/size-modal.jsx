import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

export default function SizeFormModal({
  open,
  form,
  setForm,
  onClose,
  onSubmit,
  editingId,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editingId ? "Cập nhật Size" : "Thêm Size mới"}</DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <TextField 
        sx={{mt: 1}}
          fullWidth
          label="Tên size"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
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
