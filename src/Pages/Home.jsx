import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/Image5.jpg";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full bg-black bg-opacity-80 text-white flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold">Home Decor</h1>
        <div>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition mx-2"
          >
            Signup
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Background Section */}
      <div
        className="relative flex flex-col items-center justify-center flex-grow text-white text-center px-6"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Main Content */}
        <div className="relative z-10 animate-fade-in">
          <h2 className="text-6xl font-extrabold tracking-wide drop-shadow-md">
            Welcome to Home Decor
          </h2>
          <p className="text-2xl mt-4 max-w-3xl drop-shadow-md">
            Transform your space with beautiful interior designs.
          </p>
        </div>
      </div>
    </div>
  );
}
