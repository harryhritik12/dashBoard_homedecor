import React, { useEffect, useState, useContext } from "react";
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
  Badge,
  CssBaseline,
} from "@mui/material";
import { AuthContext } from "../AuthContext";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [newInquiries, setNewInquiries] = useState([]);
  const [latestTimestamp, setLatestTimestamp] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://home-decor-backend-uh0c.onrender.com/api/contacts"
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();

      if (data.length === 0) return;

      const fetchedLatestTimestamp = new Date(data[0].submittedAt).getTime();

      if (!latestTimestamp || fetchedLatestTimestamp > latestTimestamp) {
        const newEntries = data.filter(
          (item) =>
            new Date(item.submittedAt).getTime() > (latestTimestamp || 0)
        );
        setSubmissions(data);
        setFilteredData(data);
        setLatestTimestamp(fetchedLatestTimestamp);
        setNewInquiries(newEntries.map((item) => item.id));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [latestTimestamp]);

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
    setNewInquiries([]);
  };

  return (
    <div>
      <CssBaseline />
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
          open={newInquiries.length > 0}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="info"
            sx={{ width: "100%" }}
          >
            {newInquiries.length} New Inquiry(ies) Available!
          </Alert>
        </Snackbar>

        <TextField
          label="Search by name, email, or service..."
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((submission) => (
                    <TableRow key={submission.id}>
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
                      <TableCell>
                        {newInquiries.includes(submission.id) && (
                          <Badge
                            badgeContent="New"
                            color="primary"
                            sx={{ ml: 2 }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
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
