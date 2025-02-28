import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#1a1f2b] text-white py-4 px-8 shadow-md flex items-center justify-between">
      {/* Left Spacer to balance centering */}
      <div className="w-1/3"></div>

      {/* Centered Logo */}
      <div className="text-center flex-1">
        <Link to="/" className="text-2xl font-bold hover:text-gray-300 transition">
          Home Decor
        </Link>
      </div>

      {/* Right-Aligned Buttons */}
      <div className="w-1/3 flex justify-end space-x-4">
        <Link to="/signup">
          <button className="px-5 py-2 bg-gray-700 hover:bg-gray-600 transition rounded-lg">
            Signup
          </button>
        </Link>
        <Link to="/login">
          <button className="px-5 py-2 bg-gray-700 hover:bg-gray-600 transition rounded-lg">
            Login
          </button>
        </Link>
      </div>
    </nav>
  );
}
