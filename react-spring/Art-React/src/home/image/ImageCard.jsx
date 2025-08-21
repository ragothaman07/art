import React, { useState, useEffect } from "react";
import axios from "axios";

const ImageCard = ({ id, imageUrl, imgName, caption, uploadedBy, likes, comments }) => {
  const [commentText, setCommentText] = useState("");
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [currentComments, setCurrentComments] = useState(comments);
  const [isLiked, setIsLiked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploaderName, setUploaderName] = useState("Unknown Artist");
  const userId = localStorage.getItem("userId");
  const currentUserName = localStorage.getItem("userName") || "User";
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // Fix image URL
  const getImageUrl = () => {
    if (!imageUrl) return "https://via.placeholder.com/400x300?text=Image+Not+Found";
    if (imageUrl.startsWith("http")) return imageUrl;
    if (imageUrl.startsWith("/")) return `http://localhost:8080${imageUrl}`;
    return `http://localhost:8080/uploads/${imageUrl}`;
  };

  // Determine uploader name
  useEffect(() => {
    const determineUploaderName = () => {
      if (!uploadedBy || uploadedBy === "null" || uploadedBy === "undefined") return "Unknown Artist";
      if (uploadedBy.length === 24 && /^[0-9a-fA-F]{24}$/.test(uploadedBy)) return "Unknown Artist";
      if (uploadedBy.includes("@")) return uploadedBy.split("@")[0];
      if (uploadedBy.length > 2 && uploadedBy.length < 50 && /[a-zA-Z]/.test(uploadedBy)) return uploadedBy;
      return "Unknown Artist";
    };
    setUploaderName(determineUploaderName());
  }, [uploadedBy]);

  const getUploaderInitial = () => (uploaderName === "Unknown Artist" ? "U" : uploaderName.charAt(0).toUpperCase());

  useEffect(() => {
    const checkIfLiked = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(
          `http://localhost:8080/api/artworks/${id}/hasLiked?userId=${userId}`
        );
        setIsLiked(response.data.liked);
      } catch (err) {
        console.error("Error checking like status:", err);
      }
    };
    checkIfLiked();
  }, [id, userId]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      alert("Please log in to like artworks");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/artworks/${id}/like?userId=${userId}`
      );
      setCurrentLikes(response.data.likes);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Error liking artwork:", err);
      alert("Failed to like artwork. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async () => {
    if (!isLoggedIn) {
      alert("Please log in to comment");
      return;
    }
    if (!commentText.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/artworks/${id}/comment`,
        { userId, userName: currentUserName, text: commentText }
      );
      setCurrentComments(response.data.comments || []);
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to post comment. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
  };

  return (
    <>
      {/* CARD */}
      <div className="rounded-2xl overflow-hidden cursor-pointer mb-4 bg-white shadow-lg break-inside-avoid">
        {/* Uploader */}
        <div className="px-4 pt-4 flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2 text-white font-semibold">
            {getUploaderInitial()}
          </div>
          <span className="text-sm font-semibold text-gray-800">{uploaderName}</span>
        </div>

        {/* Image */}
        <div onClick={() => setShowModal(true)} className="mt-2 px-4">
          <img
            src={getImageUrl()}
            alt={imgName || "Artwork"}
            className="w-full h-64 object-cover rounded-xl"
            onError={handleImageError}
          />
        </div>

        {/* Info */}
        <div className="px-4 py-3">
          <h3 className="font-semibold text-gray-800 text-lg">{imgName || "Untitled Artwork"}</h3>
        </div>

        {/* Actions */}
        <div className="px-4 py-3 flex items-center gap-4 border-t">
          {/* Like */}
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center gap-1 ${
              isLiked ? "text-red-500" : "text-gray-700 hover:text-red-400"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {/* SVG Like */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="lucide lucide-heart">
              <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
            </svg>
            <span className="text-sm">{currentLikes}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 text-gray-700 hover:text-blue-500"
          >
            {/* SVG Comment */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="lucide lucide-message-circle">
              <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>
            </svg>
            <span className="text-sm">{currentComments.length}</span>
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Image Side */}
            <div className="flex-1 bg-black flex items-center justify-center">
              <img
                src={getImageUrl()}
                alt={imgName || "Artwork"}
                className="max-h-full max-w-full object-contain"
                onError={handleImageError}
              />
            </div>

            {/* Comments Side */}
            <div className="w-full md:w-96 flex flex-col bg-white">
              <div className="p-4 border-b flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2 text-white font-semibold">
                  {getUploaderInitial()}
                </div>
                <span className="font-semibold text-gray-800">{uploaderName}</span>
              </div>

              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{imgName || "Untitled Artwork"}</h3>
                {caption && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border">{caption}</p>
                  </div>
                )}
              </div>

              {/* Comments */}
              <div className="flex-1 overflow-y-auto p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Comments ({currentComments.length})</h4>
                {currentComments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
                ) : (
                  currentComments.map((comment, index) => (
                    <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg border">
                      <p className="font-semibold text-gray-800 text-sm">{comment.userName || comment.userId || "Anonymous"}</p>
                      <p className="text-gray-600">{comment.text}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Recently"}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input */}
              <div className="p-3 border-t flex">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={isLoggedIn ? "Add a comment..." : "Log in to comment"}
                  disabled={!isLoggedIn || loading}
                  className="flex-1 border rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  onKeyPress={(e) => e.key === "Enter" && handleComment()}
                />
                <button
                  onClick={handleComment}
                  disabled={!isLoggedIn || loading || !commentText.trim()}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r text-sm hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "..." : "Post"}
                </button>
              </div>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 bg-white rounded-full p-2 text-gray-800 text-xl hover:text-black shadow-lg"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default ImageCard;
