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
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TasksTable = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const navigate = useNavigate();

  const loggedInUsername = localStorage.getItem('loggedInUsername');
  const isLoading = !tasks.length;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://kempshot-report.onrender.com/fetch-tasks');
        setTasks(response.data);

        if (loggedInUsername === 'Maclean') {
          setFilteredTasks(response.data);
        } else {
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
    navigate('/');
  };

  const handleNameFilterChange = (event) => {
    const filterValue = event.target.value;
    setNameFilter(filterValue);

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

      if (response.status === 200) {
        fetchData();
        handleCloseDialog();
      } else {
        console.error('Failed to update status:', response.data);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

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
              <TableCell>
                <Typography variant="subtitle1">ID</Typography>
              </TableCell>
              <TableCell>
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
              <TableCell>
                <Typography variant="subtitle1">Title</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">Content of Task</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">Date</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">Action</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">Status</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.name_of_staff}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.content_of_task}</TableCell>
                  <TableCell>{task.date}</TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => handleView(task)}>
                      View
                    </Button>
                  </TableCell>
                  <TableCell>{task.status}</TableCell>
                </TableRow>
              ))
            )}
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

export default TasksTable;
