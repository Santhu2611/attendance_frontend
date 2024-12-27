import React from "react";
import { useLocation } from "react-router-dom";

const Login = () => {
  const location = useLocation();
  const role = location.state.role;
  console.log(role);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="w-full bg-red-400 text-white text-center py-6 text-4xl font-bold">
        {role === "staff" ? "Staff Login" : "Student Login"}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-red-500 text-2xl font-semibold text-center mb-6">
          LOGIN
        </h2>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
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
            placeholder="Enter your password"
            className="w-full border-2 border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
          />
        </div>

        <button className="w-full bg-red-500 text-white text-lg font-semibold py-2 rounded-lg hover:bg-red-600 transition-all">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Login;
