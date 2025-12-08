import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem
} from "@mui/material";

export default function UserFormModal({
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
        {editingId ? "Cập nhật User" : "Thêm User"}
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <TextField
          fullWidth
          label="Tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          sx={{ mb: 2, mt: 2 }}
        />

        <TextField
          fullWidth
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          sx={{ mb: 2 }}
        />

        {!editingId && (
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            sx={{ mb: 2 }}
          />
        )}

        <TextField
          fullWidth
          label="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          select
          label="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          sx={{ mb: 2 }}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
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
 