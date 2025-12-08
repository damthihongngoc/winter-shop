import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
} from "@mui/material";

export default function ColorFormModal({
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
        {editingId ? "Cập nhật màu" : "Thêm màu mới"}
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <TextField
          fullWidth
          label="Tên màu"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          sx={{ mb: 2, mt: 2 }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            fullWidth
            label="Mã màu (VD: #FF0000)"
            value={form.hex_code}
            onChange={(e) => setForm({ ...form, hex_code: e.target.value })}
          />

          {/* Mẫu màu */}
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: form.hex_code || "#fff",
            }}
          />
        </Box>
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
