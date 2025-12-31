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
  Pagination,
  Stack,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DeleteModal from "../../modal/delete-modal";
import ProductFormModal from "../../modal/product-modal";
import { convertToFormData } from "../../service/spService";
import PageLayout from "../../component/PageLayout";

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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [itemsPerPage] = useState(10); // Số sản phẩm mỗi trang

  const [editingId, setEditingId] = useState(null);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch data with pagination
  const fetchProducts = async (page = 1) => {
    try {
      const res = await axios.get(PRODUCT_API, {
        params: {
          page: page,
          limit: itemsPerPage,
        },
      });

      setProducts(res.data.products);

      // Cập nhật thông tin phân trang
      if (res.data.pagination) {
        setCurrentPage(res.data.pagination.currentPage);
        setTotalPages(res.data.pagination.totalPages);
        setTotalProducts(res.data.pagination.totalProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    const res = await axios.get(CATEGORY_API);
    setCategories(res.data.categories);
  };

  useEffect(() => {
    fetchProducts(currentPage);
    fetchCategories();
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Submit form
  const handleSubmit = async () => {
    if (!form.name.trim()) return alert("Vui lòng nhập tên sản phẩm!");
    if (!form.category_id) return alert("Vui lòng chọn danh mục!");

    try {
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

      // Reload lại trang hiện tại
      fetchProducts(currentPage);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Có lỗi xảy ra khi lưu sản phẩm!");
    }
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
    try {
      await axios.delete(`${PRODUCT_API}/${deleteId}`);
      setDeleteId(null);

      // Nếu xóa sản phẩm cuối cùng của trang và không phải trang 1, quay về trang trước
      if (products.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchProducts(currentPage);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Có lỗi xảy ra khi xóa sản phẩm!");
    }
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
    <PageLayout
      title="Quản lý Sản phẩm"
      extra={
        <Button variant="contained" sx={{ mb: 2 }} onClick={handleCreate}>
          Thêm sản phẩm
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
          {products.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{" "}
          {Math.min(currentPage * itemsPerPage, totalProducts)} của{" "}
          {totalProducts} sản phẩm
        </Typography>
      </Box>

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
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 3 }}
                  >
                    Không có sản phẩm nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              products.map((prod) => (
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
                    {prod.status === "active" ? "Còn hàng" : "Hết hàng"}
                  </TableCell>

                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(prod)}
                    >
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
    </PageLayout>
  );
}
