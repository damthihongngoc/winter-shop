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
import SizeFormModal from "../../modal/size-modal";
import PageLayout from "../../component/PageLayout";

const API_URL = "http://localhost:3001/api/sizes";

export default function SizePage() {
  const [sizes, setSizes] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSizes, setTotalSizes] = useState(0);
  const [itemsPerPage] = useState(10);

  const [deleteId, setDeleteId] = useState(null);
  const [openFormModal, setOpenFormModal] = useState(false);

  const fetchSizes = async (page = 1) => {
    try {
      const res = await axios.get(API_URL, {
        params: { page, limit: itemsPerPage },
      });
      setSizes(res.data.sizes || res.data);

      if (res.data.pagination) {
        setCurrentPage(res.data.pagination.currentPage);
        setTotalPages(res.data.pagination.totalPages);
        setTotalSizes(res.data.pagination.totalSizes);
      }
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  useEffect(() => {
    fetchSizes(currentPage);
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

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
      fetchSizes(currentPage);
    } catch (error) {
      console.error("Error submitting size:", error);
      alert("Có lỗi xảy ra khi lưu size!");
    }
  };

  const handleEdit = (size) => {
    setForm({ name: size.name });
    setEditingId(size.size_id);
    setOpenFormModal(true);
  };

  const handleCreate = () => {
    setForm({ name: "" });
    setEditingId(null);
    setOpenFormModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteId}`);
      setDeleteId(null);

      if (sizes.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchSizes(currentPage);
      }
    } catch (error) {
      console.error("Error deleting size:", error);
      alert("Có lỗi xảy ra khi xóa size!");
    }
  };

  return (
    <PageLayout
      title="Quản lý Sizes"
      extra={
        <Button variant="contained" sx={{ mb: 2 }} onClick={handleCreate}>
          Thêm size
        </Button>
      }
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Hiển thị {sizes.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}{" "}
          - {Math.min(currentPage * itemsPerPage, totalSizes)} của {totalSizes}{" "}
          size
        </Typography>
      </Box>

      <TableContainer sx={{ minWidth: 900 }} component={Paper}>
        <Table>
          <TableHead sx={{ background: "#f3f3f3" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên size</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sizes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 3 }}
                  >
                    Không có size nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sizes.map((size) => (
                <TableRow key={size.size_id}>
                  <TableCell>{size.size_id}</TableCell>
                  <TableCell>{size.name}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(size)}
                    >
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

      <SizeFormModal
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
