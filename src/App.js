import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReportTable from './ReportTable';
import TasksTable from './TasksTable'; // Import the new component
import ReportForm from './ReportForm';
import Login from './Login';
import SubmitTask from './SubmitTask';

function App() {
  const [loggedInUsername, setLoggedInUsername] = useState('');

  const handleLogin = (username) => {
    setLoggedInUsername(username);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/report-table" element={<ReportTable />} />

        {/* Pass the loggedInUsername prop to the TasksTable component */}
        <Route path="/tasks-table" element={<TasksTable loggedInUsername={loggedInUsername} />} />

        <Route path="/submit-report" element={<ReportForm />} />
        <Route path="/submit-task" element={<SubmitTask />} />
      </Routes>
    </Router>
  );
}


export default App;
