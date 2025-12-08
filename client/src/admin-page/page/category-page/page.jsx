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
import CategoryFormModal from "../../modal/category-modal";

const API_URL = "http://localhost:3001/api/categories";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [openFormModal, setOpenFormModal] = useState(false);

  const fetchCategories = async () => {
    const res = await axios.get(API_URL);
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!form.name.trim()) return alert("Vui lòng nhập tên!");

    if (editingId) {
      await axios.put(`${API_URL}/${editingId}`, form);
    } else {
      await axios.post(API_URL, form);
    }

    setForm({ name: "", description: "" });
    setEditingId(null);
    setOpenFormModal(false);
    fetchCategories();
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description });
    setEditingId(cat.category_id);
    setOpenFormModal(true);
  };

  const handleCreate = () => {
    setForm({ name: "", description: "" });
    setEditingId(null);
    setOpenFormModal(true);
  };

  const handleDelete = async () => {
    await axios.delete(`${API_URL}/${deleteId}`);
    setDeleteId(null);
    fetchCategories();
  };

  return (
    <Box sx={{ maxWidth: 1600, margin: "40px auto" }}>
      <Typography variant="h4" mb={3}>
         Quản lý danh mmục (Categories)
      </Typography>

      {/* BUTTON THÊM */}
      <Button variant="contained" sx={{ mb: 2 }} onClick={handleCreate}>
         Thêm danh mục
      </Button>

      {/* TABLE */}
      <TableContainer component={Paper} sx={{ minWidth: "900px" }}>
        <Table>
          <TableHead sx={{ background: "#f3f3f3" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.category_id}>
                <TableCell>{cat.category_id}</TableCell>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.description}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(cat)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => setDeleteId(cat.category_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL - FORM */}
      <CategoryFormModal
        open={openFormModal}
        form={form}
        setForm={setForm}
        onClose={() => setOpenFormModal(false)}
        onSubmit={handleSubmit}
        editingId={editingId}
      />

      {/* MODAL - DELETE */}
      <DeleteModal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
