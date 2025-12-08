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

import ProductDetailFormModal from "../../modal/product-detail-modal";
import DeleteModal from "../../modal/delete-modal";

import { convertToFormData } from "../../service/spService";

const API_URL = "http://localhost:3001/api/product-details";
const PRODUCT_API = "http://localhost:3001/api/products";
const SIZE_API = "http://localhost:3001/api/sizes";
const COLOR_API = "http://localhost:3001/api/colors";

export default function ProductDetailPage() {
  const [details, setDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  const [form, setForm] = useState({
    product_id: "",
    size_id: "",
    color_id: "",
    stock: 0,
    price: "",
    image: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchAll = async () => {
    const [dRes, pRes, sRes, cRes] = await Promise.all([
      axios.get(API_URL),
      axios.get(PRODUCT_API),
      axios.get(SIZE_API),
      axios.get(COLOR_API),
    ]);
    setDetails(dRes.data);
    setProducts(pRes.data);
    setSizes(sRes.data);
    setColors(cRes.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = async () => {
    if (!form.product_id || !form.size_id || !form.color_id) {
      return alert("Vui lòng nhập đầy đủ thông tin!");
    }

    if (editingId) {
      const data = convertToFormData(form);
      await axios.put(`${API_URL}/${editingId}`, data);
    } else {
      const data = convertToFormData(form);
      await axios.post(API_URL, data);
    }

    setForm({
      product_id: "",
      size_id: "",
      color_id: "",
      stock: 0,
      price: "",
      image: "",
    });

    setEditingId(null);
    setOpenFormModal(false);
    fetchAll();
  };

  const handleEdit = (item) => {
    setForm({
      product_id: item.product_id,
      size_id: item.size_id,
      color_id: item.color_id,
      stock: item.stock,
      price: item.price,
      image: "",
    });

    setEditingId(item.detail_id);
    setOpenFormModal(true);
  };

  const handleDelete = async () => {
    await axios.delete(`${API_URL}/${deleteId}`);
    setDeleteId(null);
    fetchAll();
  };

  const handleCreate = () => {
    setForm({
      product_id: "",
      size_id: "",
      color_id: "",
      stock: 0,
      price: "",
      image: "",
    });

    setEditingId(null);
    setOpenFormModal(true);
  };

  return (
    <Box sx={{ maxWidth: 1600, margin: "40px auto" }}>
      <Typography variant="h4" mb={3}>
         Quản lý Chi tiết Sản phẩm
      </Typography>

      <Button variant="contained" sx={{ mb: 2 }} onClick={handleCreate}>
         Thêm chi tiết sản phẩm
      </Button>

      <TableContainer sx={{minWidth: 900}} component={Paper}>
        <Table>
          <TableHead sx={{ background: "#f3f3f3" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Màu</TableCell>
              <TableCell>Tồn kho</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {details.map((d) => (
              <TableRow key={d.detail_id}>
                <TableCell>{d.detail_id}</TableCell>
                <TableCell>{d.product_name}</TableCell>
                <TableCell>{d.size_name}</TableCell>

                {/* MÀU + Color Box */}
                <TableCell>
                  <span
                    style={{
                      background: d.hex_code,
                      display: "inline-block",
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      marginRight: 5,
                      border: "1px solid #ccc",
                    }}
                  ></span>
                  {d.color_name}
                </TableCell>

                <TableCell>{d.stock}</TableCell>
                <TableCell>{d.price || "Theo sản phẩm"}</TableCell>

                <TableCell>
                  {d.image ? (
                    <img
                      src={d.image}
                      alt="Ảnh sản phẩm"
                      style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(d)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton color="error" onClick={() => setDeleteId(d.detail_id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL Form */}
      <ProductDetailFormModal
        open={openFormModal}
        form={form}
        setForm={setForm}
        onClose={() => setOpenFormModal(false)}
        onSubmit={handleSubmit}
        editingId={editingId}
        products={products}
        sizes={sizes}
        colors={colors}
      />

      {/* MODAL Xóa */}
      <DeleteModal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
