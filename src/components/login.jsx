import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { BASE_URL } from "../config";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUserRole } = useUserContext(); // Set user role in context
  const role = location.state.role;
  const [login, setLogin] = useState(true);
  const [forgot, setForgot] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [id, setId] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${BASE_URL}/forgotPasswordStudent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinno: email }),
    });

    const result = await response.json();
    setMessage(result.message);
    setId(result.studentId);
    if (response.ok) {
      setOtpSent(true);
    }
    setTimeout(() => {
      setMessage("");
    }
    , 3000);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${BASE_URL}/verifyOTP`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinno: email, otp }),
    });

    const result = await response.json();
    setMessage(result.message);
    if (response.ok) {
      setResetPassword(true);
      setOtpSent(true);
    }
    setTimeout(() => {
      setMessage("");
    }
    , 3000);
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${BASE_URL}/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });

    const result = await response.json();
    setMessage(result.message);
    if (response.ok) {
      setLogin(true);
      setForgot(false);
      setOtpSent(false);
      setResetPassword(false);
    }
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const getUrl = () => {
    if (role === "staff") {
      return `${BASE_URL}/hod/login`;
    } else if (role === "student") {
      return `${BASE_URL}/students/login`;
    } else {
      return `${BASE_URL}/admin/login`;
    }
  };

  const returnTitle = () => {
    if (role === "staff") {
      return "Staff Login";
    } else if (role === "student") {
      return "Student Login";
    } else {
      return "Admin Login";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = getUrl();

    const data =
      role !== "student"
        ? { email: name, password }
        : { pinno: name, password };

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
        localStorage.setItem("staffEmail", result.hod.email);
        setUserRole(role);
        navigate("/");
      } else if (role === "student") {
        if (result.student.isVerified) {
          localStorage.setItem("id", result.student._id);
          setUserRole(role);
          alert(result.message);
          navigate("/");
        } else {
          alert("Please wait for the admin to verify your account");
        }
      } else {
        setUserRole(role);
        navigate("/");
      }

      setName("");
      setPassword("");
    } catch (error) {
      console.error(error);
    }
  };

  return login ? (
    <>
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
                className="block text-gray-700 font-medium mb-1"
              >
                {role !== "student" ? "Email" : "Roll Number"}
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder={`Enter your ${
                  role !== "student" ? "email" : "roll number"
                }`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
              >
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

            {role === "student" && (
              <button
                className="text-sm font-semibold text-red-400 mb-2"
                onClick={() => {
                  setLogin(false);
                  setForgot(true);
                }}
                type="button"
              >
                Forgot Password?
              </button>
            )}

            <button
              type="submit"
              className="w-full bg-red-500 text-white text-lg font-semibold py-2 rounded-lg hover:bg-red-600 transition-all"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  ) : forgot ? (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="w-full bg-red-400 text-white text-center py-6 text-4xl font-bold">
          Forgot Password
        </div>
        <div className="mt-8 bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          {!otpSent ? (
            <form onSubmit={handleForgotSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Roll Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your Roll Number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-2 border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-500 text-white text-lg font-semibold py-2 rounded-lg hover:bg-red-600 transition-all"
              >
                Send OTP
              </button>
            </form>
          ) : resetPassword ? (
            <form onSubmit={handleResetPasswordSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="block text-gray-700 font-medium mb-1"
                >
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full border-2 border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-500 text-white text-lg font-semibold py-2 rounded-lg hover:bg-red-600 transition-all"
              >
                Reset Password
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="otp"
                  className="block text-gray-700 font-medium mb-1"
                >
                  OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter the OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full border-2 border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-500 text-white text-lg font-semibold py-2 rounded-lg hover:bg-red-600 transition-all"
              >
                Verify OTP
              </button>
            </form>
          )}
          <p>{message}</p>
        </div>
      </div>
    </>
  ) : null;
};

export default Login;
