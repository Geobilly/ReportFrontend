import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    setLoading(true);
    const response = await axios.post('https://sqlreportsystem.onrender.com/login', {
      username,
      password,
    });

    setMessage(response.data.message);

    if (response.status === 200) {
      // Check if the username is Maclean
      if (username === 'Maclean') {
        // Redirect to the ReportTable after successful login
        navigate('/report-table');
      } else {
        // Redirect to the TaskTable for other usernames
        navigate('/tasks-table');
      }

      // Store the username in localStorage
      localStorage.setItem('loggedInUsername', username);

      // Call the onLogin prop to pass the username to the parent component
      onLogin(username);

      // Log the username to the console
      console.log('Logged in as:', username);
    }
  } catch (error) {
    setMessage('Login failed. Please check your credentials.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px' }}>
        <TextField
          label="Username"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleLogin} disabled={loading} style={{ marginTop: '10px' }}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        <Typography variant="body1" color="error" align="center" style={{ marginTop: '10px' }}>
          {message}
        </Typography>
      </div>
    </div>
  );
};

export default Login;
