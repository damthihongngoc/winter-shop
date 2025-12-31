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
import BannerFormModal from "../../modal/banner-modal";
import PageLayout from "../../component/PageLayout";

const API_URL = "http://localhost:3001/api/banners";

export default function BannerPage() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({
    title: "",
    link: "",
    thumbnail: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBanners, setTotalBanners] = useState(0);
  const [itemsPerPage] = useState(10);

  const [deleteId, setDeleteId] = useState(null);
  const [openFormModal, setOpenFormModal] = useState(false);

  // Lấy danh sách với phân trang
  const fetchBanners = async (page = 1) => {
    try {
      const res = await axios.get(API_URL, {
        params: {
          page: page,
          limit: itemsPerPage,
        },
      });

      setBanners(res.data.banners);

      // Cập nhật thông tin phân trang
      if (res.data.pagination) {
        setCurrentPage(res.data.pagination.currentPage);
        setTotalPages(res.data.pagination.totalPages);
        setTotalBanners(res.data.pagination.totalBanners);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  useEffect(() => {
    fetchBanners(currentPage);
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Thêm & cập nhật
  const handleSubmit = async () => {
    if (!form.title.trim()) return alert("Vui lòng nhập tiêu đề!");

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("link", form.link);
      if (form.thumbnail instanceof File) {
        fd.append("thumbnail", form.thumbnail);
      }

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, fd);
      } else {
        await axios.post(API_URL, fd);
      }

      setForm({ title: "", link: "", thumbnail: "" });
      setEditingId(null);
      setOpenFormModal(false);
      fetchBanners(currentPage);
    } catch (error) {
      console.error("Error submitting banner:", error);
      alert("Có lỗi xảy ra khi lưu banner!");
    }
  };

  const handleEdit = (banner) => {
    setForm({
      title: banner.title,
      link: banner.link,
      thumbnail: banner.image,
    });
    setEditingId(banner.banner_id);
    setOpenFormModal(true);
  };

  const handleCreate = () => {
    setForm({ title: "", link: "", thumbnail: "" });
    setEditingId(null);
    setOpenFormModal(true);
  };

  // Xóa
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteId}`);
      setDeleteId(null);

      // Nếu xóa banner cuối cùng của trang và không phải trang 1, quay về trang trước
      if (banners.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchBanners(currentPage);
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Có lỗi xảy ra khi xóa banner!");
    }
  };

  return (
    <PageLayout
      title="Quản lý Banner"
      extra={
        <Button variant="contained" sx={{ mb: 2 }} onClick={handleCreate}>
          Thêm Banner
        </Button>
      }
    >
      {/* Hiển thị thông tin phân trang */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Hiển thị{" "}
          {banners.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{" "}
          {Math.min(currentPage * itemsPerPage, totalBanners)} của{" "}
          {totalBanners} banner
        </Typography>
      </Box>

      <TableContainer sx={{ minWidth: 900 }} component={Paper}>
        <Table>
          <TableHead sx={{ background: "#f3f3f3" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Link</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 3 }}
                  >
                    Không có banner nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              banners.map((b) => (
                <TableRow key={b.banner_id}>
                  <TableCell>{b.banner_id}</TableCell>
                  <TableCell>{b.title}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 250,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={b.link}
                  >
                    {b.link}
                  </TableCell>
                  <TableCell>
                    {b.image ? (
                      <img
                        src={b.image}
                        alt="banner"
                        style={{ width: 80, height: 60, objectFit: "cover" }}
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(b)}>
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => setDeleteId(b.banner_id)}
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

      {/* PAGINATION */}
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

      <BannerFormModal
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
