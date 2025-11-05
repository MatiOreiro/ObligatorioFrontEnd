import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

// Componente arrow que actúa como layout/protección de rutas
const ProtectedRoute = () => {
    const isAuth = localStorage.getItem('token') !== null;

    // Si no está autenticado → redirige a login
    if (!isAuth) return <Navigate to="/" replace />;

    // Si está autenticado → renderiza rutas hijas
    return <Outlet />;
};

export default ProtectedRoute;