import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import "./profile.css";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ===== LOAD USER =====
  const loadUser = async () => {
    try {
      if (!userId) return;

      const { data } = await axios.get(
        `http://localhost:3001/api/users/${userId}`
      );
      setUser(data);

      setName(data.name || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");

      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded?.userId) {
        setUserId(decoded.user_id);
      } else {
        if (decoded?.user_id) {
          setUserId(decoded?.user_id);
        }
      }
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [userId]);

  // ===== UPDATE PROFILE =====
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const body = { name, email, phone, address };

    const res = await axios.put(
      `http://localhost:3001/api/users/${userId}`,
      body
    );

    if (res.status === 200) {
      alert("Cập nhật thông tin thành công!");
      setIsEditing(false); // Tắt chế độ chỉnh sửa
      loadUser();
    } else {
      alert("Lỗi cập nhật!");
    }
  };

  // ===== CHANGE PASSWORD =====
  const handleChangePassword = async (e) => {
    e.preventDefault();

    const body = { oldPassword, newPassword };
    const res = await axios.put(
      `http://localhost:3001/api/users/${userId}/change-password`,
      body
    );

    if (res.status === 200) {
      alert("Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
    } else {
      alert("Sai mật khẩu hoặc lỗi khác!");
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <Box sx={{ maxWidth: 1200, margin: "40px auto", padding: "20px" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Thông tin người dùng
      </Typography>

      {/* ======= CHẾ ĐỘ XEM HOẶC CHỈNH SỬA ======= */}
      {!isEditing ? (
        // ================= VIEW MODE =================
        <Box
          sx={{
            p: 3,
            borderRadius: "12px",
            boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
            backgroundColor: "white",
            minWidth: 600,
          }}
        >
          {/* Avatar + Name */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Box
              sx={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                backgroundColor: "#e0e0e0",
                backgroundImage: "url('https://i.stack.imgur.com/l60Hf.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                mr: 3,
              }}
            ></Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#333" }}>
                {user.name}
              </Typography>
              <Typography sx={{ color: "gray" }}>
                Mã người dùng: #{user.user_id}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Info list */}
          <Box sx={{ mb: 3 }}>
            <Box className="profile-info-row">
              <Typography className="label">Họ tên</Typography>
              <Typography className="value">{user.name}</Typography>
            </Box>

            <Box className="profile-info-row">
              <Typography className="label">Email</Typography>
              <Typography className="value">{user.email}</Typography>
            </Box>

            <Box className="profile-info-row">
              <Typography className="label">Số điện thoại</Typography>
              <Typography className="value">{user.phone}</Typography>
            </Box>

            <Box className="profile-info-row">
              <Typography className="label">Địa chỉ</Typography>
              <Typography className="value">{user.address}</Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              sx={{ px: 4 }}
              onClick={() => setIsEditing(true)}
            >
              Sửa thông tin
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <form onSubmit={handleUpdateProfile} className="profile-form">
            <TextField
              label="Họ tên"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Số điện thoại"
              variant="outlined"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Địa chỉ"
              variant="outlined"
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button type="submit" variant="contained" color="primary">
              Lưu thay đổi
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() => setIsEditing(false)}
            >
              Hủy
            </Button>
          </form>

          {/* ===== FORM ĐỔI MẬT KHẨU ===== */}
          <Typography variant="h5" sx={{ mb: 2 }}>
            Đổi mật khẩu
          </Typography>

          <form onSubmit={handleChangePassword} className="profile-form">
            <TextField
              label="Mật khẩu hiện tại"
              type="password"
              variant="outlined"
              fullWidth
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Mật khẩu mới"
              type="password"
              variant="outlined"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button type="submit" variant="contained" color="success">
              Cập nhật mật khẩu
            </Button>
          </form>
        </>
      )}
    </Box>
  );
}
