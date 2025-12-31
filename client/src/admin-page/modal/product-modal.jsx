import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

export default function ProductFormModal({
  open,
  onClose,
  onSubmit,
  form,
  setForm,
  categories,
  editingId,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <TextField
          select
          fullWidth
          label="Danh mục"
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          sx={{ mb: 2, mt: 2 }}
        >
          {categories.map((c) => (
            <MenuItem key={c.category_id} value={c.category_id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Tên sản phẩm"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          sx={{ mb: 2 }}
        />
        {/* 1 === 8px , 2 == 16px , 3 == 24px , 4 == 32px , 5 == 40px */}
        <TextField
          fullWidth
          label="Giá"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Mô tả"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          sx={{ mb: 2 }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, thumbnail: e.target.files[0] })}
          style={{ marginTop: 10 }}
        />

        <TextField
          select
          fullWidth
          label="Trạng thái"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          sx={{ mt: 2 }}
        >
          <MenuItem value="active">Còn hàng</MenuItem>
          <MenuItem value="inactive">Hết hàng</MenuItem>
        </TextField>
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
