import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import QRScanner from "react-qr-scanner";
import * as faceapi from "face-api.js";

const FaceComparison = () => {
  const webcamRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFaceDescriptor, setUploadedFaceDescriptor] = useState(null);
  const [matchResult, setMatchResult] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrResult, setQrResult] = useState("");

  // Load face-api.js models
  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    console.log("Face-api.js models loaded successfully.");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const image = await faceapi.fetchImage(url);
      setUploadedImage(url);

      try {
        const detections = await faceapi
          .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 }))
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (detections) {
          setUploadedFaceDescriptor(detections.descriptor);
          console.log("Face descriptor generated successfully.");
        } else {
          alert("No face detected in the uploaded image.");
        }
      } catch (error) {
        console.error("Error processing uploaded image:", error);
      }
    }
  };

  const handleCaptureAndCompare = async () => {
    if (!uploadedFaceDescriptor) {
      alert("Please upload an image with a face first.");
      return;
    }

    const capturedImage = webcamRef.current.getScreenshot();
    if (!capturedImage) {
      alert("Failed to capture image from webcam.");
      return;
    }

    const imgElement = document.createElement("img");
    imgElement.src = capturedImage;

    imgElement.onload = async () => {
      try {
        const detections = await faceapi
          .detectSingleFace(imgElement, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 }))
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (detections) {
          const distance = faceapi.euclideanDistance(
            uploadedFaceDescriptor,
            detections.descriptor
          );
          const similarityThreshold = 0.6; // Adjust threshold as needed
          if (distance < similarityThreshold) {
            setMatchResult("Faces Match!");
            setShowQRScanner(true); // Show QR scanner
          } else {
            setMatchResult("Faces Do Not Match!");
            setShowQRScanner(false);
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
      setQrResult(data.text);
      console.log("QR Code Data:", data.text);
    }
  };

  const handleError = (err) => {
    console.error("QR Scanner Error:", err);
  };

  React.useEffect(() => {
    loadModels();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h1 className="text-red-500 text-2xl font-bold mb-6">Face Comparison & QR Scanner</h1>

      {/* Face Comparison Section */}
      {!showQRScanner && (
        <div className="flex space-x-6">
          {/* Upload Image */}
          <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {uploadedImage && (
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="mt-4 w-48 h-48 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Camera Feed */}
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
        <p className={`mt-6 text-xl font-semibold ${showQRScanner ? "text-green-500" : "text-red-500"}`}>
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
          {qrResult && (
            <p className="mt-4 text-lg text-green-600">QR Code Data: {qrResult}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceComparison;
