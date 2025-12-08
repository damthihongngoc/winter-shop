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
import UserFormModal from "../../modal/user-modal";

const API_URL = "http://localhost:3001/api/users";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "user",
  });

  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openFormModal, setOpenFormModal] = useState(false);

  // 🔹 GET users
  const fetchUsers = async () => {
    const res = await axios.get(API_URL);
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Create & Update
  const handleSubmit = async () => {
    if (!form.name.trim()) return alert("Vui lòng nhập tên!");
    if (!form.email.trim()) return alert("Vui lòng nhập email!");

    if (editingId) {
      await axios.put(`${API_URL}/${editingId}`, form);
    } else {
      await axios.post(API_URL, form);
    }

    setForm({
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      role: "user",
    });

    setEditingId(null);
    setOpenFormModal(false);
    fetchUsers();
  };

  const handleEdit = (u) => {
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      phone: u.phone || "",
      address: u.address || "",
      role: u.role,
    });

    setEditingId(u.user_id);
    setOpenFormModal(true);
  };

  const handleCreate = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      role: "user",
    });
    setEditingId(null);
    setOpenFormModal(true);
  };

  // 🔹 Delete
  const handleDelete = async () => {
    await axios.delete(`${API_URL}/${deleteId}`);
    setDeleteId(null);
    fetchUsers();
  };

  return (
    <Box sx={{ maxWidth: 1400, margin: "40px auto" }}>
      <Typography variant="h4" mb={3}>
         Quản lý người dùng
      </Typography>

      <Button variant="contained" sx={{ mb: 2 }} onClick={handleCreate}>
         Thêm User
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ background: "#f3f3f3" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((u) => (
              <TableRow key={u.user_id}>
                <TableCell>{u.user_id}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phone || "-"}</TableCell>
                <TableCell>{u.address || "-"}</TableCell>
                <TableCell>{u.role}</TableCell>

                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(u)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => setDeleteId(u.user_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
      </TableContainer>

      <UserFormModal
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
