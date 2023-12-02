// ReportGrid.js

import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ReportForm from "./ReportForm"; // Import your ReportForm component
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { getStoredUsername } from "./authUtils"; // Import authUtils

const ReportGrid = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [reports, setReports] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState(null);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleViewClick = (row) => {
    setSelectedRow(row);
    setIsDialogOpen(true);
  };

  const handleAddReportClick = () => {
    // Clear the selected row to ensure the ReportForm is shown
    setSelectedRow(null);
    setIsDialogOpen(true);
  };

  const columns = [
    { field: "report_id", headerName: "Report ID", width: 100 },
    { field: "report_title", headerName: "Report Title", width: 200 },
    { field: "author_name", headerName: "Author Name", width: 200 },
    { field: "report_content", headerName: "Report Content", width: 300 },
    { field: "submission_date", headerName: "Submission Date", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => (
        <strong>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleViewClick(params.row)}
          >
            View
          </Button>
        </strong>
      ),
    },
  ];

  // Set blue color for column names
  columns.forEach((column) => {
    column.headerClassName = "blue-header";
  });

  useEffect(() => {
    // Check for logged-in username in localStorage
    const username = getStoredUsername();

    if (username) {
      // Fetch reports based on the logged-in username
      fetchReportsFromApi(username);
    } else {
      // Set an alert if no username is found
      setAlertMessage("No logged-in username found");
      setAlertSeverity("error");
    }
  }, []);

  const fetchReportsFromApi = async (username) => {
    try {
      const response = await fetch(
        `https://rmes.kempshot.com/fetch-reports/${username}`,
      );
      if (response.ok) {
        const data = await response.json();

        // Add a unique id to each report
        const reportsWithId = data.map((report, index) => ({
          ...report,
          id: index + 1, // You can use a more sophisticated id generation logic if needed
        }));

        setReports(reportsWithId);
      } else {
        console.error("Failed to fetch reports");

        // Set error message
        setAlertMessage("Failed to fetch reports");
        setAlertSeverity("error");
      }
    } catch (error) {
      console.error("Error fetching reports:", error);

      // Set error message
      setAlertMessage("Error fetching reports");
      setAlertSeverity("error");
    }
  };

  return (
    <div style={{ width: "100%", padding: "16px" }}>
      <h2
        style={{
          textAlign: "center",
          fontSize: "24px",
          color: "#1976D2",
          margin: "16px 0",
        }}
      >
        Report Grid
      </h2>

      {/* Display alert message */}
      {alertMessage && (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert severity={alertSeverity}>{alertMessage}</Alert>
        </Stack>
      )}

      <div style={{ height: 550, width: "100%" }}>
        <DataGrid
          rows={reports}
          columns={columns}
          pageSize={10}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
      {/* Clickable button at the bottom-right */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "16px",
        }}
      >
        <Button variant="contained" onClick={handleAddReportClick}>
          Add Report
        </Button>
      </Box>

      {/* Dialog for the ReportForm component or View details */}
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="xs" // Set the maximum width
        PaperProps={{
          style: {
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle style={{ textAlign: "center" }}>
          {selectedRow ? "View Report Details" : "Submit Report"}
        </DialogTitle>
        <DialogContent>
          {selectedRow ? (
            <div>
              <p>ID: {selectedRow.id}</p>
              <p>Report ID: {selectedRow.report_id}</p>
              <p>Report Title: {selectedRow.report_title}</p>
              <p>Author Name: {selectedRow.author_name}</p>
              <p>Report Content: {selectedRow.report_content}</p>
              <p>Submission Date: {selectedRow.submission_date}</p>
              {/* <p>Status: {selectedRow.status}</p> */}
            </div>
          ) : (
            <ReportForm />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReportGrid;
