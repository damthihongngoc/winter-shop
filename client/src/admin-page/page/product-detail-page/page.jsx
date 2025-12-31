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

import ProductDetailFormModal from "../../modal/product-detail-modal";
import DeleteModal from "../../modal/delete-modal";

import { convertToFormData } from "../../service/spService";
import PageLayout from "../../component/PageLayout";

const API_URL = "http://localhost:3001/api/product-details";
const PRODUCT_API = "http://localhost:3001/api/products";
const SIZE_API = "http://localhost:3001/api/sizes";
const COLOR_API = "http://localhost:3001/api/colors";

export default function ProductDetailPage() {
  const [details, setDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDetails, setTotalDetails] = useState(0);
  const [itemsPerPage] = useState(10);

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

  const fetchDetails = async (page = 1) => {
    try {
      const res = await axios.get(API_URL, {
        params: {
          page: page,
          limit: itemsPerPage,
        },
      });

      setDetails(res.data.details);

      // Cập nhật thông tin phân trang
      if (res.data.pagination) {
        setCurrentPage(res.data.pagination.currentPage);
        setTotalPages(res.data.pagination.totalPages);
        setTotalDetails(res.data.pagination.totalDetails);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [pRes, sRes, cRes] = await Promise.all([
        axios.get(PRODUCT_API),
        axios.get(SIZE_API),
        axios.get(COLOR_API),
      ]);
      setProducts(pRes.data.products);
      setSizes(sRes.data.sizes);
      setColors(cRes.data.colors);
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  useEffect(() => {
    fetchDetails(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchMetadata();
  }, []);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSubmit = async () => {
    if (!form.product_id || !form.size_id || !form.color_id) {
      return alert("Vui lòng nhập đầy đủ thông tin!");
    }

    try {
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
      fetchDetails(currentPage);
    } catch (error) {
      console.error("Error submitting product detail:", error);
      alert("Có lỗi xảy ra khi lưu chi tiết sản phẩm!");
    }
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
    try {
      await axios.delete(`${API_URL}/${deleteId}`);
      setDeleteId(null);

      // Nếu xóa item cuối cùng của trang và không phải trang 1, quay về trang trước
      if (details.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchDetails(currentPage);
      }
    } catch (error) {
      console.error("Error deleting product detail:", error);
      alert("Có lỗi xảy ra khi xóa chi tiết sản phẩm!");
    }
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
    <PageLayout
      title="Quản lý Chi tiết Sản phẩm"
      extra={
        <Button variant="contained" sx={{ mb: 2 }} onClick={handleCreate}>
          Thêm chi tiết sản phẩm
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
          {details.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{" "}
          {Math.min(currentPage * itemsPerPage, totalDetails)} của{" "}
          {totalDetails} chi tiết sản phẩm
        </Typography>
      </Box>

      <TableContainer sx={{ minWidth: 900 }} component={Paper}>
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
            {details.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 3 }}
                  >
                    Không có chi tiết sản phẩm nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              details.map((d) => (
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

                    <IconButton
                      color="error"
                      onClick={() => setDeleteId(d.detail_id)}
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
    </PageLayout>
  );
}
