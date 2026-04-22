import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children } : {children: React.ReactNode}) => {
    if (localStorage.getItem("token") === null) {
        return <Navigate to="/login" />;
    }
    return children;
}

export default PrivateRoute;