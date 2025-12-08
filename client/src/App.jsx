import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Grid from "@mui/material/Grid";

import RouterAdmin from "./admin-page/router-admin";
import UserRouter from "./user-view/page/router-user";
import RouterView from "./web-view/router-view";
import GuardRoute from "./authentication/guardRoute";

import NavBarUser from "./user-view/component/navBarUser";
import HeaderAdmin from "./admin-page/component/headerAdmin";
import NavBarAdmin from "./admin-page/component/navBarAdmin";
import Navbar from "./component/navbar";
import { Box } from "@mui/material";

function App() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={2000}
    >
      <Router>
        <Routes>
          {/* <Route
            path="/admin/*"
            element={<GuardRoute element={AdminLayout} />}
          />{" "} */}
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/profile/*" element={<RouterUserLayout />} />
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

// Giao diện chính
const MainLayout = () => (
  <>
    <Navbar />
    <RouterView /> {/* RouterView dùng useRoutes bên trong */}
    {/* <Footer /> */}
  </>
);

const RouterUserLayout = () => (
  <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
    <HeaderAdmin />

    <Box sx={{ display: "flex", flex: 1, overflow: "hidden", padding: 0 }}>
      {/* Navbar bên trái */}
      <Box
        sx={{
          padding: 0,
          width: { xs: "250px", md: "10%" },
          borderRight: "1px solid #ddd",
        }}
      >
        <NavBarUser />
      </Box>

      {/* Nội dung chính */}
      <Box
        sx={{
          flex: 1,
          padding: 3,
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <UserRouter />
      </Box>
    </Box>
  </Box>
);
const AdminLayout = () => (
  <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
    <HeaderAdmin />

    <Box sx={{ display: "flex", flex: 1, overflow: "hidden", padding: 0 }}>
      {/* Navbar bên trái */}
      <Box
        sx={{
          padding: 0,
          width: { xs: "250px", md: "10%" },
          borderRight: "1px solid #ddd",
        }}
      >
        <NavBarAdmin />
      </Box>

      {/* Nội dung chính */}
      <Box
        sx={{
          flex: 1,
          padding: 3,
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <RouterAdmin />
      </Box>
    </Box>
  </Box>
);

export default App;
