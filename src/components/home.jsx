import React from "react";
import Navbar from "./navbar";

const Home = () => {
  return (
    <div className="font-sans">
      {/* Banner */}
      <div
        className="relative bg-cover bg-center h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('https://via.placeholder.com/1500x800')", // Replace this with the actual image URL
        }}>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80"></div>

        {/* Banner Content */}
        <div className="relative text-center text-white px-4">
          <p className="uppercase text-sm md:text-lg font-semibold text-red-400 tracking-wide">
            Management
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
            QR Based Student Attendance <br />
            Management System
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300">
            A modern, efficient way to track student attendance using QR code
            technology.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
