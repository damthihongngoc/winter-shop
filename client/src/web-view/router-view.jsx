import { useRoutes, Navigate } from "react-router-dom";
import Home from "./page/home/home";
import LoginPage from "./page/login/login";
import Profile from "./page/profile/profile";
import Banner from "./page/banner/banner";
import ProductPage from "./page/productList/product-page";
import Contact from "./page/Contact/Contact";
import RegisterPage from "./page/Register/Register.jsx";
import About from "./page/About/About.jsx";
import CartPage from "./page/cart/cart.jsx";

import ProductDetailWebView from "./page/ProductDetail/page.jsx";
import OrdersPage from "./page/orders/orders.jsx";

// import tất cả component cần dùng

const RouterView = () => {
  const element = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/profile", element: <Profile /> },
    { path: "/about", element: <About /> },
    { path: "/banner", element: <Banner /> },
    { path: "products", element: <ProductPage /> },
    { path: "/products/:id", element: <ProductPage /> },
    { path: "/product-detail/:id", element: <ProductDetailWebView /> },
    { path: "/contact", element: <Contact /> },
    { path: "/cart", element: <CartPage /> },
    { path: "/orders", element: <OrdersPage /> },

    { path: "*", element: <Navigate to="/contact" replace /> },
  ]);

  return <>{element}</>;
};

export default RouterView;
