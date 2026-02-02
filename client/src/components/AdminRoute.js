import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const role = localStorage.getItem("userRole");
    if (role === "ADMIN") {
      return children;
    }
    return <Navigate to="/" />;
};

export default AdminRoute;