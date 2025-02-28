import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
} from "@mui/material";
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

      // Assuming each submission has a 'submittedAt' field
      const fetchedLatestTimestamp = new Date(data[0].submittedAt).getTime();

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

  const handleCloseSnackbar = () => {
    setNewInquiries(false);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Employee Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Snackbar
          open={newInquiries}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
            New Inquiry Available!
          </Alert>
        </Snackbar>

        <TextField
          label="Search by name, email, or service..."
          variant="outlined"
          fullWidth
          value={search}
          onChange={handleSearchChange}
          sx={{ mb: 4 }}
        />

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Budget</TableCell>
                  <TableCell>Timeline</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Submitted At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((submission, index) => (
                    <TableRow key={index}>
                      <TableCell>{submission.firstName}</TableCell>
                      <TableCell>{submission.lastName}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{submission.service}</TableCell>
                      <TableCell>
                        ₹{submission.minBudget} - ₹{submission.maxBudget}
                      </TableCell>
                      <TableCell>{submission.timeline}</TableCell>
                      <TableCell>{submission.description}</TableCell>
                      <TableCell>
                        {new Date(submission.submittedAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </div>
  );
}
