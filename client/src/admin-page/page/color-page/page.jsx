import { useState, useEffect } from "react";
import axios from "axios";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DeleteModal from "../../modal/delete-modal";
import ColorFormModal from "../../modal/color-modal";

const API_URL = "http://localhost:3001/api/colors";

export default function ColorPage() {
  const [colors, setColors] = useState([]);
  const [form, setForm] = useState({ name: "", hex_code: "" });
  const [editingId, setEditingId] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [openFormModal, setOpenFormModal] = useState(false);

  // Lấy danh sách colors
  const fetchColors = async () => {
    try {
      const res = await axios.get(API_URL);
      setColors(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách colors:", error);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  // Thêm hoặc cập nhật
  const handleSubmit = async () => {
    if (!form.name.trim()) return alert("Vui lòng nhập tên màu!");
    if (!form.hex_code.trim()) return alert("Vui lòng nhập mã màu!");

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }

      setForm({ name: "", hex_code: "" });
      setEditingId(null);
      setOpenFormModal(false);
      fetchColors();
    } catch (error) {
      console.error("Lỗi khi lưu color:", error);
    }
  };

  // Sửa
  const handleEdit = (color) => {
    setForm({ name: color.name, hex_code: color.hex_code });
    setEditingId(color.color_id);
    setOpenFormModal(true);
  };

  // Tạo mới
  const handleCreate = () => {
    setForm({ name: "", hex_code: "" });
    setEditingId(null);
    setOpenFormModal(true);
  };

  // Xóa
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteId}`);
      setDeleteId(null);
      fetchColors();
    } catch (error) {
      console.error("Lỗi khi xóa color:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 1400, margin: "40px auto" }}>
      <Typography variant="h4" mb={3}>
         Quản lý Colors
      </Typography>

      {/* BUTTON THÊM */}
      <Button variant="contained" sx={{ mb: 2 }} onClick={handleCreate}>
         Thêm màu
      </Button>

      {/* TABLE */}
      <TableContainer sx={{minWidth: 900}} component={Paper}>
        <Table>
          <TableHead sx={{ background: "#f3f3f3" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Mã màu</TableCell>
              <TableCell>Xem mẫu</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {colors.map((color) => (
              <TableRow key={color.color_id}>
                <TableCell>{color.color_id}</TableCell>
                <TableCell>{color.name}</TableCell>
                <TableCell>{color.hex_code}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      width: 40,
                      height: 20,
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      backgroundColor: color.hex_code,
                    }}
                  />
                </TableCell>

                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(color)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => setDeleteId(color.color_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL FORM */}
      <ColorFormModal
        open={openFormModal}
        form={form}
        setForm={setForm}
        onClose={() => setOpenFormModal(false)}
        onSubmit={handleSubmit}
        editingId={editingId}
      />

      {/* MODAL XÓA */}
      <DeleteModal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
