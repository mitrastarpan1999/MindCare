import React, { useState } from "react";
import { Upload, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const ProfileUpload = ({ onUploadSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const fileInput = document.getElementById("profilePictureInput");
    const file = fileInput.files[0];

    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const endpoint =
        user?.role === "psychologist"
          ? "/profile/psychologist/upload-picture"
          : "/profile/patient/upload-picture";

      const response = await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Profile picture uploaded successfully!");
      setPreview(null);
      fileInput.value = "";

      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to upload profile picture"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <User className="w-5 h-5" />
        Upload Profile Picture
      </h3>

      {/* Preview */}
      <div className="mb-4">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-purple-300"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      {/* File Input */}
      <div className="mb-4">
        <input
          id="profilePictureInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-purple-50 file:text-purple-700
            hover:file:bg-purple-100 cursor-pointer"
        />
        <p className="text-xs text-gray-500 mt-2">
          Max file size: 5MB (JPG, PNG, GIF)
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading || !preview}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? "Uploading..." : "Upload Picture"}
      </button>
    </div>
  );
};

export default ProfileUpload;
