import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

export default function ProductDetailFormModal({
  open,
  form,
  setForm,
  onClose,
  onSubmit,
  editingId,
  products,
  sizes,
  colors,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {editingId ? "Cập nhật chi tiết sản phẩm" : "Thêm chi tiết sản phẩm"}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <TextField
          select
          fullWidth
          label="Sản phẩm"
          value={form.product_id}
          onChange={(e) => setForm({ ...form, product_id: e.target.value })}
          sx={{ mb: 2 }}
        >
          {products.map((p) => (
            <MenuItem key={p.product_id} value={p.product_id}>
              {p.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Size"
          value={form.size_id}
          onChange={(e) => setForm({ ...form, size_id: e.target.value })}
          sx={{ mb: 2 }}
        >
          {sizes.map((s) => (
            <MenuItem key={s.size_id} value={s.size_id}>
              {s.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Màu"
          value={form.color_id}
          onChange={(e) => setForm({ ...form, color_id: e.target.value })}
          sx={{ mb: 2 }}
        >
          {colors.map((c) => (
            <MenuItem key={c.color_id} value={c.color_id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          type="number"
          label="Tồn kho"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Giá riêng (không bắt buộc)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          sx={{ mb: 2 }}
        />

        <Button variant="outlined" component="label">
          Chọn ảnh
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) =>
              setForm({ ...form, image: e.target.files[0] })
            }
          />
        </Button>
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
