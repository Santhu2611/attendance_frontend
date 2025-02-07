import React from "react";
import Navbar from "./navbar";
import image from "../assets/home.png";

const Home = () => {
  return (
    <div className="font-sans">
      {/* Navbar */}
      {/* <Navbar /> */}

      {/* Banner Section */}
      <div
        className="relative bg-cover bg-center h-screen flex items-center justify-center"
        style={{ backgroundImage: `url(${image})` }}>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/90"></div>

        {/* Banner Content */}
        <div className="relative text-center text-white px-6 max-w-2xl">
          <p className="uppercase text-sm md:text-lg font-semibold text-red-400 tracking-wide">
            Management
          </p>
          <h1 className="text-3xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
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
