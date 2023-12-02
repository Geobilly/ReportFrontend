import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ReportTable = () => {
  const [reports, setReports] = React.useState([]);
  const [selectedReport, setSelectedReport] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [authorFilter, setAuthorFilter] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://rmes.kempshot.com/fetch-reports",
        );
        const truncatedReports = response.data.map((report) => ({
          ...report,
          report_content_truncated:
            report.report_content.substring(0, 50) +
            (report.report_content.length > 50 ? "..." : ""),
        }));
        setReports(truncatedReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchData();
  }, []);

  const handleView = (report) => {
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleNavigateToSubmitTask = () => {
    navigate("/submit-task");
  };

  const handleNavigateToViewTask = () => {
    navigate("/tasks-table");
  };

  const handleAuthorFilterChange = (event) => {
    setAuthorFilter(event.target.value);
  };

  const uniqueAuthorNames = Array.from(
    new Set(reports.map((report) => report.author_name)),
  );

  const columns = [
    { field: "author_name", headerName: "Author Name", flex: 1 },
    {
      field: "report_content_truncated",
      headerName: "Report Content",
      flex: 2,
    },
    { field: "report_title", headerName: "Report Title", flex: 1 },
    { field: "submission_date", headerName: "Submission Date", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Button variant="outlined" onClick={() => handleView(params.row)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{ display: "flex", justifyContent: "flex-end", margin: "10px" }}
      >
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
        <Button variant="outlined" onClick={handleNavigateToViewTask}>
          VIEW TASK
        </Button>
        <Button variant="outlined" onClick={handleNavigateToSubmitTask}>
          ADD TASK
        </Button>
      </div>
      <Typography variant="h4" align="center" gutterBottom>
        Report Table
      </Typography>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={reports.filter(
            (report) => !authorFilter || report.author_name === authorFilter,
          )}
          columns={columns}
          pageSize={5}
          checkboxSelection
        />
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {selectedReport && selectedReport.report_title}
        </DialogTitle>
        <DialogContent
          style={{ overflowY: "auto", height: "70vh", wordWrap: "break-word" }}
        >
          {selectedReport && selectedReport.report_content}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReportTable;
