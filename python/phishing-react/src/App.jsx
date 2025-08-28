import React, { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      setResult(data.is_phishing ? "PHISHING WEBSITE" : "LEGITIMATE WEBSITE");
    } catch (error) {
      setError("Error connecting to the server. Make sure the backend is running.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{
        backgroundColor: "#000000",
        backgroundImage: `
          linear-gradient(-90deg, transparent calc(5em - 1px), rgba(255,255,255,0.2) calc(5em - 1px + 1px), rgba(255,255,255,0.2) 5em),
          linear-gradient(0deg, transparent calc(5em - 1px), rgba(255,255,255,0.2) calc(5em - 1px + 1px), rgba(255,255,255,0.2) 5em)
        `,
        backgroundSize: "5em 5em",
      }}
    >
      {/* Heading */}
      <h1 className="text-6xl font-extrabold text-white mb-10 drop-shadow-lg">
        Phishing Detection
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl flex gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL here"
          required
          className="flex-1 px-4 py-3 rounded-lg border border-slate-400 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check URL"}
        </button>
      </form>

      {/* Error */}
      {error && <div className="text-red-500 mt-4">{error}</div>}

      {/* Fixed result area */}
      <div className="mt-8 h-12 flex items-center justify-center">
        {result && (
          <div
            className={`text-3xl font-bold transition-opacity duration-300 ${
              result.includes("PHISHING") ? "text-red-500" : "text-green-500"
            }`}
          >
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
