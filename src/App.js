import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReportTable from './ReportTable';
import ReportForm from './ReportForm';
import Login from './Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/report-table" element={<ReportTable />} />
        <Route path="/submit-report" element={<ReportForm />} />
      </Routes>
    </Router>
  );
}

export default App;
