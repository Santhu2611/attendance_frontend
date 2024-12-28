import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import QRScanner from "react-qr-scanner";
import * as faceapi from "face-api.js";
import { BASE_URL } from "../../config";
import { ClipLoader } from "react-spinners"; // Import a spinner component
import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";
import { storage } from "../../firebase";

const FaceComparison = () => {
  const webcamRef = useRef(null);
  const [studentImage, setStudentImage] = useState(null);
  const [studentFaceDescriptor, setStudentFaceDescriptor] = useState(null);
  const [matchResult, setMatchResult] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrResult, setQrResult] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const [attendanceRecorded, setAttendanceRecorded] = useState(false); // Add state to control visibility
  const [capturedImage, setCapturedImage] = useState(null); // Add state to store captured image
  const [processingQR, setProcessingQR] = useState(false); // Add state for QR processing
  const studentId = localStorage.getItem("id");

  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    console.log("Face-api.js models loaded successfully.");
  };

  const fetchStudentImage = async () => {
    try {
      console.log("Fetching student image...");

      // Fetch student data (which includes the image URL)
      const response = await fetch(`${BASE_URL}/students/${studentId}`);
      const data = await response.json();
      console.log("Student data fetched successfully.");

      // Fetch the Base64 image from the backend
      const imageResponse = await fetch(
        `${BASE_URL}/proxy-face?url=${encodeURIComponent(data.student.photo)}`
      );
      const imageData = await imageResponse.json();
      console.log("Student image fetched successfully.");

      // Convert the Base64 URI to an image object for face-api.js
      const image = await faceapi.fetchImage(imageData.image); // Use the Base64 image URI directly
      setStudentImage(imageData.image); // You can set the Base64 URI to display the image in the UI if needed

      const detections = await faceapi
        .detectSingleFace(
          image,
          new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 })
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      console.log("Generating student face descriptor...");

      if (detections) {
        setStudentFaceDescriptor(detections.descriptor);
        console.log("Student face descriptor generated successfully.");
      } else {
        alert("No face detected in the student's image.");
      }
    } catch (error) {
      console.error("Error fetching student image:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching the image
    }
  };

  const handleCaptureAndCompare = async () => {
    if (!studentFaceDescriptor) {
      alert("Failed to load student's face descriptor.");
      return;
    }

    console.log("Capturing image from webcam...");
    const capturedImage = webcamRef.current.getScreenshot();
    if (!capturedImage) {
      alert("Failed to capture image from webcam.");
      return;
    }

    const imgElement = document.createElement("img");
    imgElement.src = capturedImage;

    imgElement.onload = async () => {
      try {
        console.log("Detecting face in captured image...");
        const detections = await faceapi
          .detectSingleFace(
            imgElement,
            new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 })
          )
          .withFaceLandmarks()
          .withFaceDescriptor();
        console.log("Face detected in captured image.");

        if (detections) {
          const distance = faceapi.euclideanDistance(
            studentFaceDescriptor,
            detections.descriptor
          );
          console.log("Face detection completed. Distance:", distance);
          const similarityThreshold = 0.6; // Adjust threshold as needed
          if (distance < similarityThreshold) {
            setMatchResult("Faces Match!");
            setShowQRScanner(true); // Show QR scanner
            setCapturedImage(capturedImage); // Store the captured image
            console.log("Faces match. Showing QR scanner.");

            const storageRef = ref(storage, `attendance-management/images/${Date.now()}.jpg`);
            console.log("Uploading captured image to Firebase...");

            try {
              await uploadBytes(storageRef, capturedImage, "data_url");
              const url = await getDownloadURL(storageRef);
              console.log("Image uploaded successfully. URL:", url);

              // Set the captured image URL for use in the attendance API
              setCapturedImage(url);
            } catch (error) {
              console.error("Error uploading image to Firebase:", error);
            }
          } else {
            setMatchResult("Faces Do Not Match!");
            setShowQRScanner(false);
            console.log("Faces do not match.");
          }
        } else {
          alert("No face detected in the camera feed.");
        }
      } catch (error) {
        console.error("Error during face detection:", error);
      }
    };
  };

  const handleScan = (data) => {
    if (data) {
       // Set processing state to true
      setQrResult(data.text);
      console.log("QR Code Data:", data.text);
      if (data.text === studentId) {
        setProcessingQR(true);
        markAttendance();
      } else {
        alert("QR code does not match student ID.");
        setProcessingQR(false); // Reset processing state
      }
    }
  };

  const handleError = (err) => {
    console.error("QR Scanner Error:", err);
  };

  const markAttendance = async () => {
    try {
      const response = await fetch(`${BASE_URL}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          date: new Date().toISOString(),
          status: "Present",
          remarks: "Verified by QR code",
          pic: capturedImage, // Include the captured image in the request
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message || "Attendance recorded successfully.");
        setAttendanceRecorded(true); // Set attendance recorded state to true
        setShowQRScanner(false); // Hide QR scanner
      } else {
        alert(`Failed to record attendance: ${result.message}`);
      }
    } catch (error) {
      console.error("Error recording attendance:", error);
      alert("Error recording attendance.");
    } finally {
      setProcessingQR(false); // Reset processing state
    }
  };

  useEffect(() => {
    console.log("Loading models and fetching student image...");
    loadModels();
    fetchStudentImage();
  }, [studentId]);

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
              {!showQRScanner && (
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
                    showQRScanner ? "text-green-500" : "text-red-500"
                  }`}>
                  {matchResult}
                </p>
              )}

              {/* QR Scanner Section */}
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
            <p className="mt-6 text-xl font-semibold text-green-500">
              Attendance recorded successfully.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default FaceComparison;
