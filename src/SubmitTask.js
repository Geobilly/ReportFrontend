import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const SubmitTask = () => {
  const [nameOfStaff, setNameOfStaff] = useState('');
  const [title, setTitle] = useState('');
  const [contentOfTask, setContentOfTask] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [usernames, setUsernames] = useState([]);

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const response = await axios.get('https://kempstasksystem.onrender.com/fetch-usernames');
        setUsernames(response.data);
      } catch (error) {
        console.error('Error fetching usernames:', error);
      }
    };

    fetchUsernames();
  }, []);

  const handleSubmit = async () => {
    try {
      // Basic validation
      if (!nameOfStaff || !title || !contentOfTask) {
        setError('Please fill in all fields.');
        return;
      }

      // Use the correct API endpoint for your Flask server
      const apiUrl = 'https://kempstasksystem.onrender.com/submit-task';

      // Send data to the Flask API
      await axios.post(apiUrl, {
        name_of_staff: nameOfStaff,
        title: title,
        content_of_task: contentOfTask,
      });

      // Reset form fields and display success message
      setNameOfStaff('');
      setTitle('');
      setContentOfTask('');
      setError('');
      setSuccessMessage('Task submitted successfully');

      // Clear success message after 6 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 6000);

    } catch (error) {
      console.error('Error submitting task:', error);
      alert('Error submitting task');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Submit Task
      </Typography>
      <form style={{ width: '300px' }}>
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="name-of-staff">Name of Staff</InputLabel>
          <Select
            value={nameOfStaff}
            onChange={(e) => setNameOfStaff(e.target.value)}
            label="Name of Staff"
            id="name-of-staff"
          >
            {usernames.map((username) => (
              <MenuItem key={username} value={username}>
                {username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Content of Task"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={contentOfTask}
          onChange={(e) => setContentOfTask(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit Task
        </Button>
        {error && <Typography color="error">{error}</Typography>}
        {successMessage && <Typography style={{ color: 'green' }}>{successMessage}</Typography>}
      </form>
    </div>
  );
};

export default SubmitTask;
