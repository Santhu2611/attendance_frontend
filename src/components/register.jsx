import { getDownloadURL, ref, uploadBytes, storage } from "../firebase";
import React, { useState } from "react";

const Registration = () => {
  const [formData, setFormData] = useState({
    rollNumber: "",
    year: "",
    department: "",
    photo: null,
    name: "",
    email: "",
    mobile: "",
    address: "",
    password: "",
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(
        storage,
        `attendance-management/images/${file.name}`
      );
      console.log("Uploading file...", file.name);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        setFormData((prev) => ({ ...prev, photo: url }));
        console.log("File uploaded successfully! Image URL: ", url);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission, like sending data to an API or saving in state
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h2 className=" mt-[5%] w-full bg-red-400 text-white text-center py-6 text-4xl font-bold">
        Register Your Account
      </h2>

      <div className="p-8 w-full max-w-[40%]">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="rollNumber"
              className="block text-gray-700 font-medium mb-1">
              Roll Number
            </label>
            <input
              type="text"
              id="rollNumber"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              className="w-full border-2 border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
              required
              placeholder="Enter your roll number"
            />
          </div>

          {/* Select Year */}
          <div className="mb-4">
            <label
              htmlFor="year"
              className="block text-gray-700 font-medium mb-1">
              Select Year
            </label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full border-2 border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
              required>
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          {/* Select Department */}
          <div className="mb-4">
            <label
              htmlFor="department"
              className="block text-gray-700 font-medium mb-1">
              Select Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border-2 border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
              required>
              <option value="">Select Department</option>
              <option value="ECE">
                Electronics and Communication Engineering
              </option>
              <option value="CSE">Computer Science Engineering</option>
              <option value="IT">Information Technology</option>
              <option value="ME">Mechanical Engineering</option>
            </select>
          </div>

          {/* Photo */}
          <div className="mb-4">
            <label
              htmlFor="photo"
              className="block text-gray-700 font-medium mb-1">
              Upload Photo
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handleImageUpload}
              className="w-full border-2 border-red-400 rounded-lg px-4 py-2"
              accept="image/*"
              required
            />
          </div>

          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border-2 border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
              required
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-2 border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
              required
              placeholder="Enter your email"
            />
          </div>

          {/* Mobile Number */}
          <div className="mb-4">
            <label
              htmlFor="mobile"
              className="block text-gray-700 font-medium mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full border-2 border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
              required
              placeholder="Enter your mobile number"
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-gray-700 font-medium mb-1">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border-2 border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
              rows="4"
              required
              placeholder="Enter your address"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border-2 border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
              required
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-500 text-white text-lg font-semibold py-2 rounded-lg hover:bg-red-600 transition-all">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
