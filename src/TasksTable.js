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

const TasksTable = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(''); // Added state for selected status
  const navigate = useNavigate();

  // Retrieve the username from localStorage
  const loggedInUsername = localStorage.getItem('loggedInUsername');

  useEffect(() => {
    // Fetch data from the Flask API when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get('https://kempshot-report.onrender.com/fetch-tasks');
        setTasks(response.data);

        // Check if the username is "Maclean"
        if (loggedInUsername === 'Maclean') {
          // If the username is "Maclean," show all tasks without filtering
          setFilteredTasks(response.data);
        } else {
          // Filter tasks based on the username for other users
          const filteredTasks = response.data.filter((task) => task.name_of_staff === loggedInUsername);
          setFilteredTasks(filteredTasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchData();
  }, [loggedInUsername]);

  const handleView = (task) => {
    setSelectedTask(task);
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

  const handleNameFilterChange = (event) => {
    const filterValue = event.target.value;
    setNameFilter(filterValue);

    // Filter tasks based on the selected name
    const updatedFilteredTasks = filterValue
      ? tasks.filter((task) => task.name_of_staff === filterValue)
      : tasks;

    setFilteredTasks(updatedFilteredTasks);
  };

  const handleUpdateStatus = async () => {
    try {
      if (!selectedTask) {
        console.error('No task selected for status update');
        return;
      }

      if (!selectedStatus) {
        console.error('No status selected for update');
        return;
      }

      const response = await axios.put(`https://kempshot-report.onrender.com/update-status/${selectedTask.id}`, {
        new_status: selectedStatus,
      });

      // Check the response status or handle it as needed
      if (response.status === 200) {
        // Refetch the tasks after updating the status
        fetchData();
        handleCloseDialog();
      } else {
        console.error('Failed to update status:', response.data);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Get unique names
  const uniqueNames = Array.from(new Set(tasks.map((task) => task.name_of_staff)));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Typography variant="h4" align="center" gutterBottom>
        Task Table
      </Typography>
      <TableContainer component={Paper}>
        <Table style={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ borderBottom: '2px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                <Typography variant="subtitle1">ID</Typography>
              </TableCell>
              <TableCell style={{ borderBottom: '2px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                <Typography variant="subtitle1">
                  Name of Staff{' '}
                  {loggedInUsername === 'Maclean' && (
                    <Select
                      label="Filter by Name"
                      value={nameFilter}
                      onChange={handleNameFilterChange}
                      size="small"
                      style={{ marginLeft: '5px' }}
                    >
                      <MenuItem value="">All Names</MenuItem>
                      {uniqueNames.map((name) => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </Typography>
              </TableCell>
              <TableCell style={{ borderBottom: '2px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                <Typography variant="subtitle1">Title</Typography>
              </TableCell>
              <TableCell style={{ borderBottom: '2px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                <Typography variant="subtitle1">Content of Task</Typography>
              </TableCell>
              <TableCell style={{ borderBottom: '2px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                <Typography variant="subtitle1">Date</Typography>
              </TableCell>
              <TableCell style={{ borderBottom: '2px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                <Typography variant="subtitle1">Action</Typography>
              </TableCell>
              <TableCell style={{ borderBottom: '2px solid rgba(224, 224, 224, 1)' }}>
                <Typography variant="subtitle1">Status</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                  {task.id}
                </TableCell>
                <TableCell style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                  {task.name_of_staff}
                </TableCell>
                <TableCell style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                  {task.title}
                </TableCell>
                <TableCell style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                  {task.content_of_task}
                </TableCell>
                <TableCell style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                  {task.date}
                </TableCell>
                <TableCell style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                  <Button variant="outlined" onClick={() => handleView(task)}>
                    View
                  </Button>
                </TableCell>
                <TableCell style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                  {/* Display task status */}
                  {task.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>{selectedTask && `Task ${selectedTask.id}`}</DialogTitle>
        <DialogContent style={{ overflowY: 'auto', height: '70vh', wordWrap: 'break-word' }}>
          <Typography variant="body1">{selectedTask && `Name of Staff: ${selectedTask.name_of_staff}`}</Typography>
          <Typography variant="body1">{selectedTask && `Title: ${selectedTask.title}`}</Typography>
          <Typography variant="body1">{selectedTask && `Content of Task: ${selectedTask.content_of_task}`}</Typography>
          <Typography variant="body1">{selectedTask && `Date: ${selectedTask.date}`}</Typography>

          {/* Dropdown for selecting status */}
          <Select
            label="Task Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ marginTop: '16px' }}
          >
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateStatus}>Update Status</Button>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
