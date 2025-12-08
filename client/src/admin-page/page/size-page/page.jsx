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
import SizeFormModal from "../../modal/size-modal";

const API_URL = "http://localhost:3001/api/sizes";

export default function SizePage() {
  const [sizes, setSizes] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [openFormModal, setOpenFormModal] = useState(false);

  // Lấy danh sách sizes
  const fetchSizes = async () => {
    try {
      const res = await axios.get(API_URL);
      setSizes(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sizes:", error);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  // Thêm hoặc cập nhật
  const handleSubmit = async () => {
    if (!form.name.trim()) return alert("Vui lòng nhập tên size!");

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }

      setForm({ name: "" });
      setEditingId(null);
      setOpenFormModal(false);
      fetchSizes();
    } catch (error) {
      console.error("Lỗi khi lưu size:", error);
    }
  };

  // Sửa
  const handleEdit = (size) => {
    setForm({ name: size.name });
    setEditingId(size.size_id);
    setOpenFormModal(true);
  };

  // Tạo mới
  const handleCreate = () => {
    setForm({ name: "" });
    setEditingId(null);
    setOpenFormModal(true);
  };

  // Xóa
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteId}`);
      setDeleteId(null);
      fetchSizes();
    } catch (error) {
      console.error("Lỗi khi xóa size:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "40px auto" }}>
      <Typography variant="h4" mb={3}>
         Quản lý Sizes
      </Typography>

      {/* BUTTON THÊM */}
      <Button variant="contained" sx={{ mb: 2 }} onClick={handleCreate}>
         Thêm size
      </Button>

      {/* TABLE */}
      <TableContainer sx={{minWidth: 900}} component={Paper}>
        <Table>
          <TableHead sx={{ background: "#f3f3f3" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên size</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sizes.map((size) => (
              <TableRow key={size.size_id}>
                <TableCell>{size.size_id}</TableCell>
                <TableCell>{size.name}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(size)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => setDeleteId(size.size_id)}
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
      <SizeFormModal
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
