import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#1a1f2b] text-white py-4 px-4 shadow-md flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="text-xl sm:text-2xl font-bold hover:text-gray-300 transition">
        Home Decor
      </Link>

      {/* Right-Aligned Buttons */}
      <div className="flex space-x-3">
        <Link to="/signup">
          <button className="px-4 py-2 text-sm sm:text-base bg-gray-700 hover:bg-gray-600 transition rounded-lg">
            Signup
          </button>
        </Link>
        <Link to="/login">
          <button className="px-4 py-2 text-sm sm:text-base bg-gray-700 hover:bg-gray-600 transition rounded-lg">
            Login
          </button>
        </Link>
      </div>
    </nav>
  );
}
