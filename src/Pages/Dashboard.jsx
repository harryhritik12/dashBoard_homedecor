import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetch("https://home-decor-backend-uh0c.onrender.com/api/contacts")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.contacts) {
          setSubmissions(data.contacts);
          setFilteredData(data.contacts);
        } else {
          console.error("Unexpected API response:", data);
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  useEffect(() => {
    setFilteredData(
      submissions.filter(
        (item) =>
          item.firstName.toLowerCase().includes(search.toLowerCase()) ||
          item.lastName.toLowerCase().includes(search.toLowerCase()) ||
          item.email.toLowerCase().includes(search.toLowerCase()) ||
          item.service.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, submissions]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Employee Dashboard</h2>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name, email, or service..."
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-auto bg-white shadow-md rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">First Name</th>
              <th className="p-3">Last Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Service</th>
              <th className="p-3">Budget</th>
              <th className="p-3">Timeline</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((submission, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{submission.firstName}</td>
                  <td className="p-3">{submission.lastName}</td>
                  <td className="p-3">{submission.email}</td>
                  <td className="p-3">{submission.service}</td>
                  <td className="p-3">
                    ${submission.minBudget} - ${submission.maxBudget}
                  </td>
                  <td className="p-3">{submission.timeline}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3" colSpan="6">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
