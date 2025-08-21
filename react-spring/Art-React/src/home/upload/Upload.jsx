import React, { useState } from "react";
import axios from "axios";

const Upload = () => {
  const [image, setImage] = useState(null);
  const [imgName, setImgName] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!image || !imgName) {
      alert("Please select an image and provide a name");
      return;
    }

    setUploading(true);
    
    try {
      const userId = localStorage.getItem("userId");
      const userName = localStorage.getItem("userName") || "Unknown Artist";
      
      console.log("Uploading with - userId:", userId, "userName:", userName);
      
      // SEND USERNAME DIRECTLY instead of user ID
      const formData = new FormData();
      formData.append("image", image);
      formData.append("imgName", imgName);
      formData.append("caption", caption);
      formData.append("uploadedBy", userName); // Send username directly
      
      const response = await axios.post("http://localhost:8080/api/artworks/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("Artwork uploaded successfully!");
        setImage(null);
        setImgName("");
        setCaption("");
        document.getElementById("image-upload").value = "";
        window.location.reload();
      } else {
        alert("Failed to upload artwork: " + response.data.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload artwork. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Artwork</h1>
      
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Artwork Name
          </label>
          <input
            type="text"
            value={imgName}
            onChange={(e) => setImgName(e.target.value)}
            placeholder="Enter artwork name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Caption (Optional)
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter a caption for your artwork"
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
            uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {uploading ? "Uploading..." : "Upload Artwork"}
        </button>
      </form>
    </div>
  );
};

export default Upload;