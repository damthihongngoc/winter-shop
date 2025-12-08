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
import BannerFormModal from "../../modal/banner-modal";

const API_URL = "http://localhost:3001/api/banners";

export default function BannerPage() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({
    title: "",
    link: "",
    thumbnail: "",
  });
  const [editingId, setEditingId] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [openFormModal, setOpenFormModal] = useState(false);

  // Lấy danh sách
  const fetchBanners = async () => {
    const res = await axios.get(API_URL);
    setBanners(res.data);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Thêm & cập nhật
  const handleSubmit = async () => {
    if (!form.title.trim()) return alert("Vui lòng nhập tiêu đề!");

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
    fetchBanners();
  };

  const handleEdit = (banner) => {
    setForm({
      title: banner.title,
      link: banner.link,
      thumbnail: banner.thumbnail,
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
    await axios.delete(`${API_URL}/${deleteId}`);
    setDeleteId(null);
    fetchBanners();
  };

  return (
    <Box sx={{ maxWidth: 1400, margin: "40px auto" }}>
      <Typography variant="h4" mb={3}>
         Quản lý Banner
      </Typography>

      <Button variant="contained" sx={{ mb: 2 }} onClick={handleCreate}>
         Thêm Banner
      </Button>

      <TableContainer sx={{minWidth: 900}} component={Paper}>
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
            {banners.map((b) => (
              <TableRow key={b.banner_id}>
                <TableCell>{b.banner_id}</TableCell>
                <TableCell>{b.title}</TableCell>
                <TableCell>{b.link}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
    </Box>
  );
}
