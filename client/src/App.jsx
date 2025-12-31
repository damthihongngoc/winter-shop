import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Grid from "@mui/material/Grid";

import RouterAdmin from "./admin-page/router-admin";
import UserRouter from "./user-view/page/router-user";
import RouterView from "./web-view/router-view";
import GuardRoute from "./authentication/guardRoute";

import NavBarUser from "./user-view/component/navBarUser";
import HeaderAdmin from "./admin-page/component/headerAdmin";
import Navbar from "./component/navbar";
import { Box } from "@mui/material";
import Footer from "./component/Footer";
import CategoryPage from "./admin-page/page/category-page/page";
import ProductAdmin from "./admin-page/page/product-page/page";
import ColorPage from "./admin-page/page/color-page/page";
import SizePage from "./admin-page/page/size-page/page";
import ProductDetailPage from "./admin-page/page/product-detail-page/page";
import BannerPage from "./admin-page/page/banner-page/page";
import UserPage from "./admin-page/page/user-page/page";
import OrdersPage from "./admin-page/page/orders-page/page";
import AdminSidebar from "./admin-page/component/AdminSidebar";
import Dashboard from "./component/Dashboard";
import { SocketProvider } from "./contexts/SocketContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import NotificationButton from "./component/NotificationButton";

function App() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      autoHideDuration={2000}
    >
      <SocketProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route
                path="/admin/*"
                element={<GuardRoute element={AdminLayout} />}
              >
                <Route index element={<Dashboard />} />
                <Route path="product" element={<ProductAdmin />} />
                <Route path="category" element={<CategoryPage />} />
                <Route path="colors" element={<ColorPage />} />
                <Route path="sizes" element={<SizePage />} />
                <Route path="product-detail" element={<ProductDetailPage />} />
                <Route path="banner" element={<BannerPage />} />
                <Route path="users" element={<UserPage />} />
                <Route path="orders" element={<OrdersPage />} />
              </Route>
              <Route path="/*" element={<MainLayout />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </SocketProvider>
    </SnackbarProvider>
  );
}

// Giao diện chính
const MainLayout = () => (
  <>
    <Navbar />
    <RouterView /> {/* RouterView dùng useRoutes bên trong */}
    <Footer />
    <NotificationButton />
  </>
);

const AdminLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      <AdminSidebar />

      <main
        style={{
          flex: 1,
          padding: "24px",
          marginLeft: "240px",
          width: "100%",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </main>

      <NotificationButton />
    </div>
  );
};

export default App;
