import React from "react";
import { AiFillCamera } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleNavigate = (role) => {
    navigate("/login", { state: { role } }); // Navigate with state
  };

  return (
    <nav className="flex items-center justify-between bg-white pl-8 h-16 border-b border-gray-200 fixed top-0 left-0 w-full z-50">
      {/* Logo/Title */}
      <div className="text-3xl font-semibold text-gray-800 tracking-wide">
        QR Attendance
      </div>

      {/* Nav Links and Attendance Scan Button */}
      <div className="flex items-center">
        {/* Navigation Links */}
        <ul className="flex space-x-6 text-base font-medium mr-4">
          <li>
            <button
              onClick={() => navigate("/")}
              className="text-gray-700 hover:text-red-500 transition-all">
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigate("staff")}
              className="text-gray-700 hover:text-red-500 transition-all">
              Staff
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigate("student")}
              className="text-gray-700 hover:text-red-500 transition-all">
              Students
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/registration")}
              className="text-gray-700 hover:text-red-500 transition-all">
              Registration
            </button>
          </li>
        </ul>

        <button
          onClick={() => navigate("/scan")}
          className="flex items-center justify-center space-x-2 text-bold text-white bg-red-500 hover:bg-red-600 px-6 py-5 h-full transition-all">
          <span>Attendance Scan</span>
          <AiFillCamera className="text-lg" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
