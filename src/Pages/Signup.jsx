import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) {
        setError((prev) => ({ ...prev, email: "Only @gmail.com emails are allowed!" }));
      } else {
        setError((prev) => ({ ...prev, email: "" }));
      }
    }

    if (name === "password") {
      if (value.length < 6) {
        setError((prev) => ({ ...prev, password: "Password must be at least 6 characters!" }));
      } else {
        setError((prev) => ({ ...prev, password: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error.email || error.password) return;

    setLoading(true);
    try {
      await axios.post("https://dashboard-backend-0rig.onrender.com/api/auth/signup", formData);
      navigate("/login");
    } catch (err) {
      setError((prev) => ({ ...prev, email: err.response?.data?.message || "Signup failed" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-2xl rounded-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
            required
          />
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email (must be @gmail.com)"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
              required
            />
            {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
          </div>
          <button
            type="submit"
            disabled={!!error.email || !!error.password || loading}
            className={`w-full py-3 rounded-lg transition-all duration-300 ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-gray-900 underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
