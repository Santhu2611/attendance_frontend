// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "./context/UserContext";

const ProtectedRoute = ({ children }) => {
    const { userRole } = useUserContext();

    // Redirect to "/" if no user is logged in
    if (!userRole) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
