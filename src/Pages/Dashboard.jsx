import { useEffect, useState, useContext } from "react";
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

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch("https://home-decor-backend-uh0c.onrender.com/api/contacts");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();

      if (data.length === 0) return; // No data to process

      // Assuming each submission has a 'timestamp' field
      const fetchedLatestTimestamp = new Date(data[data.length - 1].timestamp).getTime();

      if (!latestTimestamp || fetchedLatestTimestamp > latestTimestamp) {
        setSubmissions(data);
        setFilteredData(data);
        setLatestTimestamp(fetchedLatestTimestamp);
        setNewInquiries(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [latestTimestamp]);

  const updateWithNewInquiries = () => {
    setNewInquiries(false);
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

      {newInquiries && (
        <div className="mb-4 bg-blue-500 text-white p-3 rounded flex justify-between">
          <span>🔔 New Inquiry Available!</span>
          <button
            onClick={updateWithNewInquiries}
            className="bg-white text-blue-500 px-3 py-1 rounded"
          >
            Show New Inquiry
          </button>
        </div>
      )}

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
              <th className="p-3">Description</th>
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
                  <td className="p-3">₹{submission.minBudget} - ₹{submission.maxBudget}</td>
                  <td className="p-3">{submission.timeline}</td>
                  <td className="p-3">{submission.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-3 text-center">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
