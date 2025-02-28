import { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [newInquiries, setNewInquiries] = useState(false);
  const [latestTimestamp, setLatestTimestamp] = useState(null);
  const [newRows, setNewRows] = useState(new Set()); // Track new rows

  // Function to fetch data from the API
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("https://home-decor-backend-uh0c.onrender.com/api/contacts");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();

      if (data.length === 0) return;

      const fetchedLatestTimestamp = new Date(data[0].submittedAt).getTime();

      if (!latestTimestamp || fetchedLatestTimestamp > latestTimestamp) {
        setNewInquiries(true);

        // Store only new submissions for highlighting
        const newSubmissions = data.filter((submission) => {
          return latestTimestamp && new Date(submission.submittedAt).getTime() > latestTimestamp;
        });

        setNewRows(new Set(newSubmissions.map((sub) => sub.id)));

        setSubmissions(data);
        setFilteredData(data);
        setLatestTimestamp(fetchedLatestTimestamp);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [latestTimestamp]);

  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [fetchData]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    setFilteredData(
      submissions.filter(
        (item) =>
          item.firstName.toLowerCase().includes(search.toLowerCase()) ||
          item.lastName.toLowerCase().includes(search.toLowerCase()) ||
          item.email.toLowerCase().includes(search.toLowerCase()) ||
          item.service.toLowerCase().includes(search.toLowerCase()) ||
          item.minBudget.toString().includes(search.toLowerCase()) ||
          item.maxBudget.toString().includes(search.toLowerCase()) ||
          item.timeline.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, submissions]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Show new inquiries and remove the notification
  const handleShowNewInquiries = () => {
    setNewInquiries(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800">Employee Dashboard</h2>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition">
          Logout 🚪
        </button>
      </div>

      {/* Notification */}
      {newInquiries && (
        <div className="mb-4 bg-blue-500 text-white p-3 rounded-lg shadow-md flex justify-between items-center">
          <span className="font-semibold">🔔 New Inquiry Available!</span>
          <button onClick={handleShowNewInquiries} className="bg-white text-blue-500 px-3 py-1 rounded-lg shadow-sm hover:bg-blue-100 transition">
            Show New Inquiry
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="🔍 Search by name, email, or service..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 transition"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Table */}
      <div className="overflow-auto bg-white shadow-lg rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200 text-gray-700 font-semibold">
            <tr>
              <th className="p-4">First Name</th>
              <th className="p-4">Last Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Service</th>
              <th className="p-4">Budget</th>
              <th className="p-4">Timeline</th>
              <th className="p-4">Description</th>
              <th className="p-4">📅 Submitted At</th>
              <th className="p-4">Status</th> {/* New column for "New" badge */}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((submission) => (
                <tr key={submission.id} className={`border-b transition ${newRows.has(submission.id) ? "bg-green-100 animate-pulse" : ""}`}>
                  <td className="p-4">{submission.firstName}</td>
                  <td className="p-4">{submission.lastName}</td>
                  <td className="p-4">{submission.email}</td>
                  <td className="p-4">{submission.service}</td>
                  <td className="p-4">₹{submission.minBudget} - ₹{submission.maxBudget}</td>
                  <td className="p-4">{submission.timeline}</td>
                  <td className="p-4">{submission.description}</td>
                  <td className="p-4 text-gray-600">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    {newRows.has(submission.id) && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                        New
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-6 text-center text-gray-500">No inquiries found 😕</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
