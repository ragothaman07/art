import React, { useState, useEffect } from "react";
import axios from "axios";
import ImageCard from "../image/ImageCard";

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        console.log("Fetching artworks from backend...");
        const response = await axios.get("http://localhost:8080/api/artworks", {
          timeout: 10000,
        });

        // Filter out any null or undefined artworks
        const validArtworks = response.data
          .filter((artwork) => artwork && artwork.id)
          .map((artwork) => ({
            id: artwork.id || "",
            imageUrl: artwork.imageUrl || "",
            imgName: artwork.imgName || "Untitled",
            caption: artwork.caption || "",
            uploadedBy: artwork.uploadedBy || "",
            likedBy: artwork.likedBy || [],
            comments: artwork.comments || [],
            createdAt: artwork.createdAt || new Date().toISOString(),
          }));

        console.log("Valid artworks fetched successfully:", validArtworks);
        setArtworks(validArtworks);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching artworks:", err);

        if (err.code === "ECONNREFUSED") {
          setError(
            "Cannot connect to server. Please make sure the backend is running on port 8080."
          );
        } else if (err.response?.status === 401) {
          setError("Authentication required. Please log in again.");
        } else if (err.response?.status === 403) {
          setError("Access forbidden. You don't have permission to view artworks.");
        } else if (err.response?.status === 404) {
          setError("Artworks endpoint not found. Please check the backend URL.");
        } else if (err.response) {
          setError(
            `Server error: ${err.response.status} - ${err.response.statusText}`
          );
        } else if (err.request) {
          setError("No response from server. Please check your network connection.");
        } else {
          setError("Failed to load artworks. Please try again later.");
        }
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        Loading artworks...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error: </strong> {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const filteredArtworks = artworks.filter(
    (artwork) =>
      artwork.imgName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.uploadedBy?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search artworks by name, caption, or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <div className="absolute right-3 top-3 text-gray-400">🔍</div>
        </div>
      </div>

      {/* Artwork Count */}
      <div className="text-gray-600 mb-6">
        <span className="font-semibold text-blue-600">
          {filteredArtworks.length} of {artworks.length}
        </span>{" "}
        artwork{artworks.length !== 1 ? "s" : ""}
        {searchQuery && ` found for "${searchQuery}"`}
      </div>

      {/* Masonry Layout */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
        {filteredArtworks.map((artwork) => (
          <ImageCard
            key={artwork.id}
            id={artwork.id}
            imageUrl={artwork.imageUrl}
            imgName={artwork.imgName}
            caption={artwork.caption}
            uploadedBy={artwork.uploadedBy}
            likes={artwork.likedBy.length}
            comments={artwork.comments}
          />
        ))}
      </div>

      {filteredArtworks.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-12">
          <div className="text-6xl mb-4">🎨</div>
          <p className="text-lg font-semibold">No artworks found.</p>
          <p className="text-sm mt-2">
            {searchQuery ? "Try a different search term or " : ""}
            Upload some artwork to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
