import React from "react";
import { Link, useLocation } from "react-router-dom";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import InfoIcon from "@mui/icons-material/Info";
import BarChartIcon from "@mui/icons-material/BarChart";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

const menuItems = [
  { path: "/admin", label: "Trang chủ", icon: <BarChartIcon /> },
  { path: "/admin/banner", label: "Banner", icon: <InventoryIcon /> },
  { path: "/admin/category", label: "Danh mục", icon: <InventoryIcon /> },
  { path: "/admin/product", label: "Sản phẩm", icon: <ShoppingCartIcon /> },
  {
    path: "/admin/product-detail",
    label: "Chi tiết sản phẩm",
    icon: <InfoIcon />,
  },
  { path: "/admin/colors", label: "Màu sắc", icon: <ColorLensIcon /> },
  { path: "/admin/sizes", label: "Kích cỡ", icon: <FormatSizeIcon /> },
  {
  path: "/admin/users",
  label: "Quản lý user",
  icon: <PeopleIcon />,
}
];

const NavBarAdmin = () => {
  const location = useLocation();
  return (
    <Box
      sx={{
        width: "260px",
        backgroundColor: "#fff",
        padding: "30px 20px",
        borderRight: "1px solid #ddd",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: "#1f1f1f",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Quản lý hệ thống
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              sx={{
                borderRadius: "12px",
                mb: 1,
                backgroundColor: isActive ? "#8aad51" : "transparent",
                color: isActive ? "#fff" : "#1f1f1f",
                transition: "0.25s",
                "&:hover": {
                  backgroundColor: "#8aad51",
                  color: "#fff",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? "#fff" : "#1f1f1f",
                  minWidth: "40px",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: "15px", fontWeight: 500 }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};

export default NavBarAdmin;
