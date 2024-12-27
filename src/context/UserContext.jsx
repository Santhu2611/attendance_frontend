// src/context/UserContext.js
import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null); // Store user role

    const logout = () => {
        setUserRole(null); // Reset user role to null
    };

    return (
        <UserContext.Provider value={{ userRole, setUserRole, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
