import React from "react";

const Header = ({ activeTab, setActiveTab }) => {
  const userName = localStorage.getItem("userName") || "User";
  const userEmail = localStorage.getItem("userEmail") || "";
  
  // Get first letter for profile picture placeholder
  const profileInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="bg-white shadow-md flex justify-between items-center px-6 py-3">
      <h1 className="text-xl font-bold text-gray-700">🎨 Art Gallery</h1>

      <div className="flex items-center space-x-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-4 py-2 rounded ${
              activeTab === "gallery" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Gallery
          </button>

          <button
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-2 rounded ${
              activeTab === "upload" ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            Upload
          </button>
        </div>
        
        {/* User Profile */}
        <div className="flex items-center space-x-2 ml-4">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {profileInitial}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-800">{userName}</p>
            <p className="text-xs text-gray-500">{userEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;