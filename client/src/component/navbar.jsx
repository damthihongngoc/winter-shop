import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./style/navbar.scss";
import { jwtDecode } from "jwt-decode";
import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { useCart } from "../hook/CartContext";

function Navbar() {
  const { cartQuantity } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [decode, setDecoded] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setDecoded(jwtDecode(token));
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);

  const onLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  console.log("cartQuantity navbar", cartQuantity);
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        👔 <span>WinterShop</span>
      </div>

      <div className={`navbar-links ${isOpen ? "active" : ""}`}>
        <Link to="/">Trang chủ</Link>

        {/* Dropdown Sản phẩm */}
        <Link to="/products">Sản phẩm</Link>
        <Link to="/about">Giới thiệu</Link>
        <Link to="/contact">Liên hệ</Link>
        <Link to="/cart" className="cart-link">
          🛒 Giỏ hàng
          {cartQuantity > 0 && (
            <span className="cart-badge">{cartQuantity}</span>
          )}
        </Link>
        {isLogin ? (
          <Box>
            <MenuItem onClick={handleOpen} sx={{ opacity: 1 }}>
              <Typography sx={{ fontWeight: 600 }}>{decode.name}</Typography>
            </MenuItem>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 4,
                sx: {
                  minWidth: 180,
                  borderRadius: 2,
                  overflow: "hidden",
                },
              }}
            >
              {/* Tên người dùng */}
              <MenuItem disabled sx={{ opacity: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>{decode.name}</Typography>
              </MenuItem>

              <MenuItem component={Link} to="/profile/user">
                Thông tin cá nhân
              </MenuItem>

              <MenuItem
                onClick={() => {
                  onLogout();
                }}
              >
                Đăng xuất
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Link
            to="/login"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
              Login
            </Typography>
          </Link>
        )}
      </div>

      {/* Toggle cho mobile */}
      <div className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </nav>
  );
}

export default Navbar;
