// src/components/login.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { BASE_URL } from "../config";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUserRole } = useUserContext(); // Set user role in context
  const role = location.state.role;

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const getUrl = () => {
    if(role === "staff") {
      return `${BASE_URL}/hod/login`;
    } else if(role === "student") {
      return `${BASE_URL}/students/login`;
    }
    else {
      return `${BASE_URL}/admin/login`;
    }
  };

  const returnTitle = () => {
    if(role === "staff") {
      return "Staff Login";
    } else if(role === "student") {
      return "Student Login";
    }
    else {
      return "Admin Login";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = getUrl();
      
    const data =
      role !== "student" ? { email: name, password } : { pinno: name, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        throw new Error("Network response was not ok");
      }

      // Set role in context and navigate to home

      if (role === "staff") {
        setUserRole(role);
        navigate("/");
      } else if(role === "student") {
        if (result.student.isVerified) {
          localStorage.setItem("id", result.student._id);
          setUserRole(role);
          alert(result.message);
          navigate("/");
        } else {
          alert("Please wait for the admin to verify your account");
        }
      }
      else {
        setUserRole(role);
        navigate("/");
      }

      setName("");
      setPassword("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="w-full bg-red-400 text-white text-center py-6 text-4xl font-bold">
        {returnTitle()}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-red-500 text-2xl font-semibold text-center mb-6">
          LOGIN
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-1">
              {role === "staff" ? "Email" : "Roll Number"}
            </label>
            <input
              id="name"
              type="text"
              required
              placeholder={`Enter your ${
                role === "staff" ? "email" : "roll number"
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 text-white text-lg font-semibold py-2 rounded-lg hover:bg-red-600 transition-all">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
