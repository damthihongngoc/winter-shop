import { useRoutes, Navigate } from "react-router-dom";
import AdminPage from "./page/landing-page/page";
import CategoryPage from "./page/category-page/page";
import ProductAdmin from "./page/product-page/page";
import ColorPage from "./page/color-page/page";
import SizePage from "./page/size-page/page";
import ProductDetailPage from "./page/product-detail-page/page";
import BannerPage from "./page/banner-page/page";
import UserPage from "./page/user-page/page";

// Import tất cả component admin

const RouterAdmin = () => {
  const element = useRoutes([
    { path: "/", element: <AdminPage /> },
    { path: "/category", element: <CategoryPage /> },
    { path: "/product", element: <ProductAdmin /> },
    { path: "/colors", element: <ColorPage /> },
    { path: "/sizes", element: <SizePage /> },
    { path: "/product-detail", element: <ProductDetailPage /> },
    { path: "/banner", element: <BannerPage /> },
    { path: "/users", element: <UserPage /> },
    // fallback: nếu path không khớp => chuyển về login
    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ]);

  return element;
};

export default RouterAdmin;
