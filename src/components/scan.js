// Import required dependencies
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { getDownloadURL, ref, uploadBytes, storage } from "../firebase";
import * as faceapi from "face-api.js";

const FaceComparison = () => {
  const webcamRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFaceDescriptor, setUploadedFaceDescriptor] = useState(null);
  const [matchResult, setMatchResult] = useState("");

  // Load face-api.js models
  const loadModels = async () => {
    const MODEL_URL = "/models"; // Path to face-api.js models
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  };

  // Handle Image Upload to Firebase and Process
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(
        storage,
        `attendance-management/images/${file.name}`
      );
      console.log("Uploading file...", file.name);
      try {
        // Upload image to Firebase
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        console.log("File uploaded successfully! Image URL: ", url);

        // Load image from URL for face detection
        const proxiedUrl = `http://localhost:4000/proxy?url=${encodeURIComponent(
          url
        )}`;
        const image = await faceapi.fetchImage(proxiedUrl);
        console.log("Image loaded successfully.", image);
        setUploadedImage(url);

        // Detect and compute face descriptor
        const detections = await faceapi
          .detectSingleFace(image)
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (detections) {
          setUploadedFaceDescriptor(detections.descriptor);
          console.log("Face descriptor generated successfully.");
        } else {
          alert("No face detected in the uploaded image.");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  // Capture Face from Camera and Compare
  const handleCaptureAndCompare = async () => {
    if (!uploadedFaceDescriptor) {
      alert("Please upload an image with a face first.");
      return;
    }

    const capturedImage = webcamRef.current.getScreenshot();
    const imgElement = document.createElement("img");
    imgElement.src = capturedImage;

    // Detect and compute face descriptor for the captured image
    const detections = await faceapi
      .detectSingleFace(imgElement)
      .withFaceLandmarks()
      .withFaceDescriptor();
    console.log("Face detected in the camera feed:", detections);
    if (detections) {
      const distance = faceapi.euclideanDistance(
        uploadedFaceDescriptor,
        detections.descriptor
      );
      const similarityThreshold = 0.6; // Lower is better (0 = identical)

      if (distance < similarityThreshold) {
        setMatchResult("Faces Match!");
      } else {
        setMatchResult("Faces Do Not Match!");
      }
    } else {
      alert("No face detected in the camera feed.");
    }
  };

  // Load models on component mount
  React.useEffect(() => {
    loadModels();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h1 className="text-red-500 text-2xl font-bold mb-6">Face Comparison</h1>

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

      {/* Match Result */}
      {matchResult && (
        <p className="mt-6 text-xl font-semibold text-gray-800">
          {matchResult}
        </p>
      )}
    </div>
  );
};

export default FaceComparison;
