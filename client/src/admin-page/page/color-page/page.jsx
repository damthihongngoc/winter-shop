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
  Pagination,
  Stack,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DeleteModal from "../../modal/delete-modal";
import ColorFormModal from "../../modal/color-modal";
import PageLayout from "../../component/PageLayout";

const API_URL = "http://localhost:3001/api/colors";

export default function ColorPage() {
  const [colors, setColors] = useState([]);
  const [form, setForm] = useState({ name: "", hex_code: "" });
  const [editingId, setEditingId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalColors, setTotalColors] = useState(0);
  const [itemsPerPage] = useState(10);

  const [deleteId, setDeleteId] = useState(null);
  const [openFormModal, setOpenFormModal] = useState(false);

  const fetchColors = async (page = 1) => {
    try {
      const res = await axios.get(API_URL, {
        params: { page, limit: itemsPerPage },
      });
      setColors(res.data.colors || res.data);

      if (res.data.pagination) {
        setCurrentPage(res.data.pagination.currentPage);
        setTotalPages(res.data.pagination.totalPages);
        setTotalColors(res.data.pagination.totalColors);
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  };

  useEffect(() => {
    fetchColors(currentPage);
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

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
      fetchColors(currentPage);
    } catch (error) {
      console.error("Error submitting color:", error);
      alert("Có lỗi xảy ra khi lưu màu!");
    }
  };

  const handleEdit = (color) => {
    setForm({ name: color.name, hex_code: color.hex_code });
    setEditingId(color.color_id);
    setOpenFormModal(true);
  };

  const handleCreate = () => {
    setForm({ name: "", hex_code: "" });
    setEditingId(null);
    setOpenFormModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteId}`);
      setDeleteId(null);

      if (colors.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchColors(currentPage);
      }
    } catch (error) {
      console.error("Error deleting color:", error);
      alert("Có lỗi xảy ra khi xóa màu!");
    }
  };

  return (
    <PageLayout
      title="Quản lý Colors"
      extra={
        <Button variant="contained" sx={{ mb: 2 }} onClick={handleCreate}>
          Thêm màu
        </Button>
      }
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Hiển thị{" "}
          {colors.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{" "}
          {Math.min(currentPage * itemsPerPage, totalColors)} của {totalColors}{" "}
          màu
        </Typography>
      </Box>

      <TableContainer sx={{ minWidth: 900 }} component={Paper}>
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
            {colors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 3 }}
                  >
                    Không có màu nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              colors.map((color) => (
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
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(color)}
                    >
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Stack>
      )}

      <ColorFormModal
        open={openFormModal}
        form={form}
        setForm={setForm}
        onClose={() => setOpenFormModal(false)}
        onSubmit={handleSubmit}
        editingId={editingId}
      />

      <DeleteModal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </PageLayout>
  );
}
