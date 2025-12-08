import { useRoutes, Navigate } from "react-router-dom";
import UserProfile from "./profile/profile-user";

const UserRouter = () => {
  const element = useRoutes([
    {
      path: "/user",
      element: <UserProfile />,
    },

    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ]);

  return element;
};

export default UserRouter;
