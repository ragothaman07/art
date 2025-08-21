import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import mona from "../assets/img/mona.jpg";

const Login = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // 🔹 Login Handler
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store user data in localStorage with proper validation
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email || "");
        localStorage.setItem("userId", data.userId || "");
        
        // Handle username properly - use data.userName or fallback to email prefix
        const userName = data.userName || (email ? email.split('@')[0] : "User");
        localStorage.setItem("userName", userName);
        
        alert("✅ " + data.message);
        navigate("/home");
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("⚠️ Something went wrong while logging in!");
    }
  };

  // 🔹 Signup Handler
  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store user data after signup with proper validation
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email || "");
        localStorage.setItem("userId", data.userId || "");
        
        // Handle username properly - use the provided name or fallback to email prefix
        const userName = name || (email ? email.split('@')[0] : "User");
        localStorage.setItem("userName", userName);
        
        alert("🎉 " + data.message + " Please login.");
        setShowLogin(true);
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("⚠️ Something went wrong while signing up!");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {/* Heading Section */}
      <div className="w-full h-[16%] flex items-center justify-center">
        <h1 className="text-center font-bold text-gray-800 text-[1.8vw]">
          Welcome to the Art Gallery
        </h1>
      </div>

      {/* Content Section */}
      <div className="w-full h-[84%] flex justify-center items-center">
        <div className="relative w-[70%] h-[90%] max-w-[900px] grid grid-cols-2 rounded-2xl overflow-hidden shadow-lg border border-gray-300">
          
          {/* 🔹 Login Panel */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div
              onClick={() => setShowLogin(true)}
              className={`absolute inset-0 z-20 cursor-pointer bg-cover bg-center transform transition-all duration-700 ease-in-out ${
                showLogin ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
              }`}
              style={{ backgroundImage: `url(${mona})` }}
            />

            <div
              className={`z-10 w-[80%] text-center transition-all duration-700 ${
                showLogin ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
              }`}
            >
              <h2 className="text-[1.5vw] font-semibold mb-[3%]">Login</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-[2%] w-full mb-[2%] rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-[2%] w-full mb-[2%] rounded"
              />
              
              <button
                onClick={handleLogin}
                className="cursor-pointer uppercase bg-white px-4 py-2 mt-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#F44336,-0.5rem_-0.5rem_#00BCD4] transition"
              >
                Login
              </button>
            </div>
          </div>

          {/* 🔹 Sign Up Panel */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div
              onClick={() => setShowLogin(false)}
              className={`absolute inset-0 z-20 cursor-pointer bg-cover bg-center transform transition-all duration-700 ease-in-out ${
                showLogin ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
              }`}
              style={{ backgroundImage: `url(${mona})` }}
            />

            <div
              className={`z-10 w-[80%] text-center transition-all duration-700 ${
                showLogin ? "opacity-0 translate-y-5 pointer-events-none" : "opacity-100 translate-y-0"
              }`}
            >
              <h2 className="text-[1.5vw] font-semibold mb-[3%]">Sign Up</h2>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-[2%] w-full mb-[2%] rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-[2%] w-full mb-[2%] rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-[2%] w-full mb-[2%] rounded"
              />
              
              <button
                onClick={handleSignup}
                className="cursor-pointer uppercase bg-white px-4 py-2 mt-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#F44336,-0.5rem_-0.5rem_#00BCD4] transition"
              >
                Sign Up
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;