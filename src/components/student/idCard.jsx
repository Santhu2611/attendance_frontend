import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { BASE_URL } from "../../config";

const StudentIDCard = () => {
  const [student, setStudent] = useState(null);
  const studentId = localStorage.getItem("id");
  const cardRef = useRef(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/students/${studentId}`);
        const data = await response.json();
        setStudent(data.student);
        const studentImage = data.student.photo;
        setImage(studentImage);

        // Only call getProxiedImageUrl if the image URL is valid
        if (studentImage) {
          getProxiedImageUrl(studentImage);
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    const getProxiedImageUrl = async (url) => {
      if (!url) {
        console.error("No image URL provided");
        return;
      }

      try {
        const response = await fetch(
          `${BASE_URL}/proxy?url=${encodeURIComponent(url)}`
        );
        const data = await response.json();
        console.log(data);
        const proxiedImageUrl = `${BASE_URL}${data.url}`;
        console.log(proxiedImageUrl);
        setImage(proxiedImageUrl); // Set the proxied image URL
        console.log("Proxied image URL:", data.url);
      } catch (error) {
        console.error("Error fetching proxied image:", error);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  // Handle Download
  const handleDownload = () => {
    const cardElement = cardRef.current;

    // Use html2canvas to capture the element
    html2canvas(cardElement, {
      scale: 2, // Double the resolution for better quality
      useCORS: true, // Handle cross-origin images
      allowTaint: true,
    }).then((canvas) => {
      // Create a downloadable link
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `${student.name || "student_id"}.png`;
      link.click();
    });
  };

  if (!student) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div
        // Attach the ref to the card element
        className="bg-white border-2 border-red-500 rounded-lg shadow-md w-80 relative overflow-hidden">
        {/* Top Clip */}
        <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 bg-red-500 w-16 h-4 rounded-t-lg"></div>

        {/* Card Content */}
        <div ref={cardRef} className="p-6 text-center">
          <h1 className="text-lg font-bold text-gray-600 mb-2">
            Student ID Card
          </h1>
          <img
            src={image || "https://via.placeholder.com/100"}
            alt="Student Photo"
            className="w-20 h-20 mx-auto rounded-full border-2 border-gray-300"
          />
          <h2 className="text-2xl font-bold mt-4">{student.name}</h2>
          <p className="text-sm text-gray-500 mt-1">Roll No: {student.pinno}</p>
          <p className="text-sm text-gray-500">
            Department: {student.department}
          </p>
          <div className="mt-4">
            {student.qrCodeUrl ? (
              <img
                src={student.qrCodeUrl}
                alt="QR Code"
                className="w-24 h-24 mx-auto"
              />
            ) : (
              <div className="text-gray-400 italic">QR Code not available</div>
            )}
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="mt-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600">
        Download ID Card
      </button>
    </div>
  );
};

export default StudentIDCard;
