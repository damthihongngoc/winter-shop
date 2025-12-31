import { useRoutes, Navigate } from "react-router-dom";
import UserProfile from "./profile/profile-user";
import UserOrdersPage from "./orders/orders-user";

const UserRouter = () => {
  const element = useRoutes([
    {
      path: "/user",
      element: <UserProfile />,
    },
    {
      path: "/don-hang/tat-ca",
      element: <UserOrdersPage />,
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ]);

  return element;
};

export default UserRouter;
