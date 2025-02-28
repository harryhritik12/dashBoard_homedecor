import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Employee Dashboard</h2>
      <button onClick={() => { logout(); navigate("/login"); }} className="bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
}
