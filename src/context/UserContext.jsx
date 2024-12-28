// src/context/UserContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(() => {
        // Retrieve user role from localStorage (if any) on initialization
        return localStorage.getItem("userRole") || null;
    });

    const setRole = (role) => {
        setUserRole(role);
        localStorage.setItem("userRole", role); // Persist in localStorage
    };

    const logout = () => {
        setUserRole(null);
        localStorage.removeItem("userRole"); // Clear user role on logout
    };

    return (
        <UserContext.Provider value={{ userRole, setUserRole: setRole, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
