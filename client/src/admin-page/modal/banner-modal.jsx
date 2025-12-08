import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
} from "@mui/material";

export default function BannerFormModal({
  open,
  form,
  setForm,
  onClose,
  onSubmit,
  editingId,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editingId ? "Cập nhật Banner" : "Thêm Banner"}</DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <TextField
          fullWidth
          label="Tiêu đề"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          sx={{ mb: 2, mt: 2 }}
        />

        <TextField
          fullWidth
          label="Link (nếu có)"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          sx={{ mb: 2 }}
        />

        {/* UPLOAD ẢNH */}
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" component="label">
            Chọn ảnh
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm({ ...form, thumbnail: e.target.files[0] })
              }
            />
          </Button>
        </Box>

        {/* Preview ảnh */}
        {form.thumbnail && (
          <Box sx={{ mb: 2 }}>
            <img
              src={
                form.thumbnail instanceof File
                  ? URL.createObjectURL(form.thumbnail)
                  : form.thumbnail
              }
              alt="preview"
              style={{
                width: "100%",
                height: 160,
                objectFit: "cover",
                borderRadius: 6,
              }}
            />
          </Box>
        )}
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
