import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import Home from "./components/home";
import Navbar from "./components/navbar";
import Login from "./components/login";
import Registration from "./components/register";
import FaceComparison from "./components/scan";
import { UserProvider } from "./context/UserContext";
import StudentActivations from "./components/staff/studApproval";
import StudentDetails from "./components/staff/studDetails";
import CheckAttendance from "./components/staff/checkAttendance";

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
        <Route path="/scan" element={<FaceComparison />} />
        <Route path="/students-approval" element={<StudentActivations />} />
        <Route path="/students-details" element={<StudentDetails />} />
        <Route path="/check-attendance" element={<CheckAttendance />} />
      </Routes>
      </UserProvider>
    </BrowserRouter>
    {/* <App /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
