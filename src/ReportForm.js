import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Snackbar, SnackbarContent } from '@mui/material';
import axios from 'axios';

// ... (import statements)

const ReportForm = () => {
  const [report, setReport] = useState({
    report_title: '',
    author_name: '',
    report_content: '',
    attachments: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (
      report.report_title.trim() === '' ||
      report.author_name.trim() === '' ||
      report.report_content.trim() === ''
    ) {
      console.error('Please fill in all compulsory fields');
      return;
    }

    try {
      const response = await axios.post('https://kempstasksystem.onrender.com/submit-report', report);
      console.log(response.data);

      setSuccessMessage('Report submitted successfully');
      setOpenSnackbar(true);

      // Clear form fields after successful submission
      setReport({
        report_title: '',
        author_name: '',
        report_content: '',
        attachments: '',
      });
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={3}>
        <Typography variant="h4" align="center">
          Submit Report
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Report Title"
            name="report_title"
            fullWidth
            margin="normal"
            value={report.report_title}
            onChange={handleChange}
            required
          />
          <TextField
            label="Author Name"
            name="author_name"
            fullWidth
            margin="normal"
            value={report.author_name}
            onChange={handleChange}
            required
          />
         <TextField
            label="Report Content"
            name="report_content"
            multiline
            fullWidth
            margin="normal"
            value={report.report_content}
            onChange={handleChange}
            required
            variant="outlined"
            size="large"
            rows={8} // You can adjust the number of rows as needed
          />

          {/* <TextField
            label="Attachments"
            name="attachments"
            fullWidth
            margin="normal"
            value={report.attachments}
            onChange={handleChange}
          /> */}
          <Box mt={2}>
            <Button variant="contained" color="primary" type="submit">
              Submit Report
            </Button>
          </Box>
        </form>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <SnackbarContent
            message={
              <Box textAlign="center">
                <Typography variant="body1" color="inherit">
                  {successMessage}
                </Typography>
              </Box>
            }
          />
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ReportForm;

