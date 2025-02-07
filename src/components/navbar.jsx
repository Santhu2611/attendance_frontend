import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { AiFillCamera, AiOutlineLogout } from "react-icons/ai";

const Navbar = () => {
  const navigate = useNavigate();
  const { userRole, logout } = useUserContext(); // Access user context and logout function

  const handleLogout = () => {
    logout(); 
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between bg-white pl-8 h-16 border-b border-gray-200 fixed top-0 left-0 w-full z-50">
      {/* Logo/Title */}
      <div className="text-3xl font-semibold text-gray-800 tracking-wide">
        QR Attendance
      </div>

      {/* Conditional Navigation Links */}
      <div className="flex items-center">
        {!userRole ? ( // Render if no user is logged in
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
                onClick={() => navigate("/login", { state: { role: "admin" } })}
                className="text-gray-700 hover:text-red-500 transition-all">
                Admin
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/login", { state: { role: "staff" } })}
                className="text-gray-700 hover:text-red-500 transition-all">
                Staff
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/login", { state: { role: "student" } })}
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
        ) : (
          <ul className="flex space-x-6 text-base font-medium mr-4">
            {/* Render different navigation options based on user role */}
            <li>
              <button
                onClick={() => navigate("/")}
                className="text-gray-700 hover:text-red-500 transition-all">
                Home
              </button>
            </li>
            {userRole === "admin" && (
              <li>
              <button
                onClick={() => navigate("/students-approval")}
                className="text-gray-700 hover:text-red-500 transition-all">
                Students Approval
              </button>
            </li>
            )}
            {userRole === "staff" && (
              <>
                <li>
                  <button
                    onClick={() => navigate("/students-details")}
                    className="text-gray-700 hover:text-red-500 transition-all">
                    Students Details
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/check-attendance")}
                    className="text-gray-700 hover:text-red-500 transition-all">
                    Check Attendance
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/staff-attendance-logs")}
                    className="text-gray-700 hover:text-red-500 transition-all">
                    Attendance Logs
                  </button>
                </li>
              </>
            )}
            {userRole === "student" && (
              <>
                <li>
                  <button
                    onClick={() => navigate("/student-attendance-logs")}
                    className="text-gray-700 hover:text-red-500 transition-all">
                    Attendance Logs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/download-id-card")}
                    className="text-gray-700 hover:text-red-500 transition-all">
                    Download ID Card
                  </button>
                </li>
              </>
            )}
          </ul>
        )}
        {userRole === "staff" && ( 
          <button
          onClick={() => navigate("/scan")}
          className="flex items-center justify-center space-x-2 text-bold text-white bg-red-500 hover:bg-red-600 px-6 py-5 h-full transition-all">
          <span>Attendance Scan</span>
          <AiFillCamera className="text-lg" />
        </button>
        )}
        {userRole && (
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 text-bold text-white bg-gray-700 hover:bg-gray-800 px-6 py-5 h-full transition-all">
            <span>Logout</span>
            <AiOutlineLogout className="text-lg" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
