import React, { useState, useEffect } from 'react';
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReportTable = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [authorFilter, setAuthorFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the Flask API when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get('https://sqlreportsystem.onrender.com/fetch-reports');
        // Truncate the report content for display in the table
        const truncatedReports = response.data.map((report) => ({
          ...report,
          report_content_truncated: report.report_content.substring(0, 50) + (report.report_content.length > 50 ? '...' : ''),
        }));
        setReports(truncatedReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
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
    // Perform logout actions, e.g., clear authentication tokens, user data, etc.
    // Redirect the user to the login screen
    navigate('/');
  };

  const handleNavigateToSubmitTask = () => {
    // Navigate to the "Submit Task" screen
    navigate('/submit-task');
  };

  const handleNavigateToViewTask = () => {
    // Navigate to the "Submit Task" screen
    navigate('/tasks-table');
  };

  const handleAuthorFilterChange = (event) => {
    setAuthorFilter(event.target.value);
  };

  // Get unique author names
  const uniqueAuthorNames = Array.from(new Set(reports.map((report) => report.author_name)));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
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
      <TableContainer component={Paper}>
        <Table style={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ borderBottom: '2px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                <Typography variant="subtitle1">
                  Author Name{' '}
                  <Select
                    label="Filter by Author Name"
                    value={authorFilter}
                    onChange={handleAuthorFilterChange}
                    size="small"
                    style={{ marginLeft: '5px' }}
                  >
                    <MenuItem value="">All Authors</MenuItem>
                    {uniqueAuthorNames.map((authorName) => (
                      <MenuItem key={authorName} value={authorName}>
                        {authorName}
                      </MenuItem>
                    ))}
                  </Select>
                </Typography>
              </TableCell>
              <TableCell style={{ borderBottom: '2px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                <Typography variant="subtitle1">Report Content</Typography>
              </TableCell>
              <TableCell style={{ borderBottom: '2px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                <Typography variant="subtitle1">Report Title</Typography>
              </TableCell>
              <TableCell style={{ borderBottom: '2px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                <Typography variant="subtitle1">Submission Date</Typography>
              </TableCell>
              <TableCell style={{ borderBottom: '2px solid rgba(224, 224, 224, 1)' }}>
                <Typography variant="subtitle1">Action</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports
              .filter((report) => !authorFilter || report.author_name === authorFilter)
              .map((report) => (
                <TableRow key={report.submission_date}>
                  <TableCell style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                    {report.author_name}
                  </TableCell>
                  <TableCell style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                    {report.report_content_truncated}
                  </TableCell>
                  <TableCell style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                    {report.report_title}
                  </TableCell>
                  <TableCell style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                    {report.submission_date}
                  </TableCell>
                  <TableCell style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                    <Button variant="outlined" onClick={() => handleView(report)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>{selectedReport && selectedReport.report_title}</DialogTitle>
        <DialogContent style={{ overflowY: 'auto', height: '70vh', wordWrap: 'break-word' }}>
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
