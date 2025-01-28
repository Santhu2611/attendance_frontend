import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import QRScanner from "react-qr-scanner";
import { BASE_URL } from "../../config";
import { ClipLoader } from "react-spinners"; // Import a spinner component
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";

const FaceComparison = () => {
  const webcamRef = useRef(null);
  const [studentImage, setStudentImage] = useState(null);
  const [matchResult, setMatchResult] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(true);
  const [qrResult, setQrResult] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [attendanceRecorded, setAttendanceRecorded] = useState(false);
  const [processingQR, setProcessingQR] = useState(false);
  const [studentId1, setStudentId1] = useState("");
  const [storedImageUrl, setStoredImageUrl] = useState("");

  const fetchStudentImage = async (studentId) => {
    try {
      console.log("Fetching student image...");

      // Fetch student data (which includes the image URL)
      const response = await fetch(`${BASE_URL}/students/${studentId}`);

      if(!response.ok) {
        alert("Student not found.");
        return;
      }

      const data = await response.json();
      console.log("Student data fetched successfully.");
      setStoredImageUrl(data.student.photo);

      // Fetch the Base64 image from the backend
      const imageResponse = await fetch(
        `${BASE_URL}/proxy-face?url=${encodeURIComponent(data.student.photo)}`
      );
      const imageData = await imageResponse.json();
      console.log("Student image fetched successfully.");

      setStudentImage(imageData.image); // You can set the Base64 URI to display the image in the UI if needed
    } catch (error) {
      console.error("Error fetching student image:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching the image
    }
  };

  const handleCaptureAndCompare = async () => {
    console.log("Capturing image from webcam...");
    const capturedImage = webcamRef.current.getScreenshot();
    if (!capturedImage) {
      alert("Failed to capture image from webcam.");
      return;
    }

    const storageRef = ref(storage, `attendance-management/images/${Date.now()}.jpg`);
    console.log("Uploading captured image to Firebase...");

    try {
      // Convert Base64 to Blob and upload
      const base64ToBlob = (base64Data) => {
        const byteString = atob(base64Data.split(',')[1]);
        const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
          uint8Array[i] = byteString.charCodeAt(i);
        }

        return new Blob([arrayBuffer], { type: mimeString });
      };
      const blob = base64ToBlob(capturedImage);
      await uploadBytes(storageRef, blob);

      const liveImageUrl = await getDownloadURL(storageRef);
      console.log("Image uploaded successfully. URL:", liveImageUrl);

      // Log URLs before sending to Face++
      console.log("Stored Image URL:", storedImageUrl);
      console.log("Live Image URL:", liveImageUrl);

      // Send request to backend for face comparison
      const response = await fetch(`${BASE_URL}/compare`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storedImageUrl: storedImageUrl,
          liveImageUrl,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMatchResult("Faces Match!");
        console.log("Faces match.");

        markAttendance(liveImageUrl);
      } else {
        setMatchResult("Faces Do Not Match!");
        console.log("Faces do not match:", result.error || result.message);
      }
    } catch (error) {
      console.error("Error during face comparison:", error);
    }
  };

  const handleScan = async (data) => {
    if (data) {
      setQrResult(data.text);
      console.log("QR Code Data:", data.text);
      if (data.text) {
        setProcessingQR(true);
        setStudentId1(data.text);
        setShowQRScanner(false); // Hide QR scanner after successful scan
        await fetchStudentImage(data.text);
         // Reset processing state
         setProcessingQR(false);
      } else {
        alert("QR code does not match student ID.");
        setProcessingQR(false); // Reset processing state
      }
    }
  };

  const handleError = (err) => {
    console.error("QR Scanner Error:", err);
  };

  const markAttendance = async (imageUrl) => {
    try {
      const response = await fetch(`${BASE_URL}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: studentId1,
          date: new Date().toISOString(),
          status: "Present",
          remarks: "Verified by QR code and face comparison",
          pic: imageUrl, // Include the captured image in the request
        }),
      });

      const result = await response.json();
      if (response.status === 200) {
        alert(result.message || "Attendance recorded successfully.");
        setAttendanceRecorded(true); // Set attendance recorded state to true
      } else if(response.status === 400) {
        alert(`${result.message}`);
        setAttendanceRecorded(true);
      }
      else {
        alert("Failed to record attendance.");
      }
    } catch (error) {
      console.error("Error recording attendance:", error);
      alert("Error recording attendance.");
    } finally {
      setProcessingQR(false); // Reset processing state
    }
  };

  const resetState = () => {
    setStudentImage(null);
    setMatchResult("");
    setShowQRScanner(true);
    setQrResult("");
    setLoading(false);
    setAttendanceRecorded(false);
    setProcessingQR(false);
    setStudentId1("");
    setStoredImageUrl("");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h1 className="text-red-500 text-2xl font-bold mb-6">
        Face Comparison & QR Scanner
      </h1>

      {loading ? (
        <ClipLoader size={50} color={"#EF4444"} loading={loading} />
      ) : (
        <>
          {!attendanceRecorded && (
            <>
              {showQRScanner && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold">QR Scanner</h2>
                  <QRScanner
                    delay={300}
                    style={{ width: "300px", height: "300px" }}
                    onScan={handleScan}
                    onError={handleError}
                  />
                </div>
              )}

              {!showQRScanner && !processingQR && (
                <div className="flex space-x-6">
                  <div>
                    {studentImage && (
                      <img
                        src={studentImage}
                        alt="Student"
                        className="mt-4 w-48 h-48 object-cover rounded-lg"
                      />
                    )}
                  </div>

                  <div>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-48 h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={handleCaptureAndCompare}
                      className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg">
                      Capture & Compare
                    </button>
                  </div>
                </div>
              )}

              {/* Match Result */}
              {matchResult && (
                <p
                  className={`mt-6 text-xl font-semibold ${
                    matchResult === "Faces Match!" ? "text-green-500" : "text-red-500"
                  }`}>
                  {matchResult}
                </p>
              )}

              {/* Processing QR Code */}
              {processingQR && (
                <div className="mt-8">
                  <ClipLoader size={50} color={"#EF4444"} loading={processingQR} />
                  <p className="mt-4 text-xl font-semibold text-gray-500">
                    Processing QR Code...
                  </p>
                </div>
              )}
            </>
          )}

          {attendanceRecorded && (
            <>
              <p className="mt-6 text-xl font-semibold text-green-500">
                Attendance recorded successfully.
              </p>
              <button
                onClick={resetState}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
                Take Attendance for Another Student
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FaceComparison;
