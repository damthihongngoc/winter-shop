import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Box,
  Button,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  ShoppingCart,
  AccountCircle,
  Phone,
  Storefront,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

const HeaderAdmin = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const apiUrl = import.meta.env.VITE_URL_SERVER;

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const checkRole = async () => {
      if (!token) {
        setUserInfo(null);
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:3001/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.isAdmin === false) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setUserInfo({
          ...res.data.user,
          isAdmin: res.data.isAdmin,
        });
      } catch (error) {
        console.error("Error:", error);

        // Lỗi 401 → token hết hạn hoặc sai → xóa token
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
        }
        setUserInfo(null);
        navigate("/login");
      }
    };
    checkRole();
  }, []);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsOpen(false);
  };
  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <AppBar position="static" sx={{ backgroundColor: "#8aad51" }}>
      <Toolbar>
        {/*Bên trái sau thêm logo hoặc gì đó */}
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              marginRight: 2,
              color: "white",
              textDecoration: "none",
            }}
          ></Typography>
        </Box>

        {/* Right section: User and Cart */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {userInfo ? (
            <>
              <Button
                variant="text"
                sx={{ padding: 2, color: "#fff" }}
                onClick={handleMenuOpen}
              >
                {userInfo.AVATAR ? (
                  //chưa lấy đc avt
                  <Avatar
                    src={`${api}/images/${userInfo.AVATAR}`}
                    alt={userInfo.AVATAR}
                  />
                ) : (
                  <AccountCircle />
                )}
                <Typography variant="body2" sx={{ ml: 2, color: "white" }}>
                  {userInfo.name || "Người dùng"}
                </Typography>
              </Button>
              {/* Menu các tùy chọn */}
              <Menu
                anchorEl={anchorEl}
                open={isOpen}
                onClose={handleMenuClose}
                sx={{ mt: 1 }}
              >
                <MenuItem component={Link} to="/profile/user">
                  Thông tin cá nhân
                </MenuItem>

                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {" "}
              <IconButton
                component={Link} // Sử dụng Link làm component
                to="/login"
                sx={{
                  color: "white",
                  textDecoration: "none",
                }}
              >
                <AccountCircle />
                <Typography variant="body2" sx={{ marginLeft: 1 }}>
                  Đăng nhập
                </Typography>
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderAdmin;
