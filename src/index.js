import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import Home from "./components/home";
import Navbar from "./components/navbar";
import Login from "./components/login";
import Registration from "./components/register";
import FaceComparison from "./components/staff/scan";
import { UserProvider } from "./context/UserContext";
import StudentActivations from "./components/staff/studApproval";
import StudentDetails from "./components/staff/studDetails";
import CheckAttendance from "./components/staff/checkAttendance";
import StudentIDCard from "./components/student/idCard";
import ProtectedRoute from "./protectedRoute";
import StudentAttendanceLogs from "./components/student/attendanceLogs";
import StaffAttendanceLogs from "./components/staff/staffAttendLogs";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />

          {/* Protected routes */}
          <Route
            path="/scan"
            element={
              <ProtectedRoute>
                <FaceComparison />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students-approval"
            element={
              <ProtectedRoute>
                <StudentActivations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students-details"
            element={
              <ProtectedRoute>
                <StudentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/check-attendance"
            element={
              <ProtectedRoute>
                <CheckAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/download-id-card"
            element={
              <ProtectedRoute>
                <StudentIDCard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-attendance-logs"
            element={
              <ProtectedRoute>
                <StudentAttendanceLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff-attendance-logs"
            element={
              <ProtectedRoute>
                <StaffAttendanceLogs />
              </ProtectedRoute>
            }
          />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
