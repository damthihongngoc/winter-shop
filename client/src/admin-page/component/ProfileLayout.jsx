import { Box, Tabs, Tab } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { label: "Thông tin cá nhân", value: "/profile" },
  { label: "Đơn hàng", value: "/profile/orders" },
  // { label: "Bảo mật", value: "/profile/security" },
];

export default function ProfileLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab =
    tabs.find((t) => location.pathname === t.value)?.value ||
    tabs.find((t) => location.pathname.startsWith(t.value))?.value ||
    "/profile";

  return (
    <Box sx={{ width: "100%", padding: 3 }}>
      {/* TAB MENU */}
      <Tabs
        value={currentTab}
        onChange={(e, value) => navigate(value)}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>

      {/* NỘI DUNG TAB */}
      <Box sx={{ marginTop: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
