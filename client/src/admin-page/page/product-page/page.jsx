import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DeleteModal from "../../modal/delete-modal";
import ProductFormModal from "../../modal/product-modal";
import { convertToFormData } from "../../service/spService";

const PRODUCT_API = "http://localhost:3001/api/products";
const CATEGORY_API = "http://localhost:3001/api/categories";

export default function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    category_id: "",
    name: "",
    description: "",
    price: "",
    thumbnail: "",
    status: "active",
  });

  const [editingId, setEditingId] = useState(null);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch data
  const fetchProducts = async () => {
    const res = await axios.get(PRODUCT_API);
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get(CATEGORY_API);
    setCategories(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Submit form
  const handleSubmit = async () => {
    if (!form.name.trim()) return alert("Vui lòng nhập tên sản phẩm!");
    if (!form.category_id) return alert("Vui lòng chọn danh mục!");

    if (editingId) {
      const input = convertToFormData(form);
      await axios.put(`${PRODUCT_API}/${editingId}`, input);
    } else {
      await axios.post(PRODUCT_API, convertToFormData(form));
    }

    setForm({
      category_id: "",
      name: "",
      description: "",
      price: "",
      thumbnail: "",
      status: "active",
    });

    setEditingId(null);
    setOpenFormModal(false);
    fetchProducts();
  };

  // Edit
  const handleEdit = (prod) => {
    setForm({
      category_id: prod.category_id,
      name: prod.name,
      description: prod.description || "",
      price: prod.price,
      thumbnail: "",
      status: prod.status,
    });
    setEditingId(prod.product_id);
    setOpenFormModal(true);
  };

  // Delete
  const handleDelete = async () => {
    await axios.delete(`${PRODUCT_API}/${deleteId}`);
    setDeleteId(null);
    fetchProducts();
  };

  const handleCreate = () => {
    setForm({
      category_id: "",
      name: "",
      description: "",
      price: "",
      thumbnail: "",
      status: "active",
    });
    setEditingId(null);
    setOpenFormModal(true);
  };

  return (
    <Box sx={{ maxWidth: 1600, margin: "40px auto" }}>
      <Typography variant="h4" mb={3}>
         Quản lý Sản phẩm
      </Typography>

      <Button variant="contained" sx={{ mb: 2 }} onClick={handleCreate}>
         Thêm sản phẩm
      </Button>

      {/* TABLE */}
      <TableContainer component={Paper} sx={{ minWidth: "900px" }}>
        <Table>
          <TableHead sx={{ background: "#f3f3f3" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((prod) => (
              <TableRow key={prod.product_id}>
                <TableCell>{prod.product_id}</TableCell>
                <TableCell>{prod.name}</TableCell>
                <TableCell>{prod.price}</TableCell>
                <TableCell>{prod.category_name}</TableCell>

                <TableCell>
                  {prod.thumbnail ? (
                    <img
                      src={prod.thumbnail}
                      alt={prod.name}
                      width={60}
                      height={60}
                      style={{ objectFit: "cover", borderRadius: 6 }}
                    />
                  ) : (
                    "—"
                  )}
                </TableCell>

                <TableCell
                  sx={{
                    color: prod.status === "active" ? "green" : "gray",
                    fontWeight: 600,
                  }}
                >
                  {prod.status}
                </TableCell>

                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(prod)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => setDeleteId(prod.product_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* FORM MODAL */}
      <ProductFormModal
        open={openFormModal}
        form={form}
        categories={categories}
        setForm={setForm}
        onClose={() => setOpenFormModal(false)}
        onSubmit={handleSubmit}
        editingId={editingId}
      />

      {/* DELETE MODAL */}
      <DeleteModal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
