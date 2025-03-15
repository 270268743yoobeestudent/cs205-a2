// frontend/src/components/ReportGenerator.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/styles.css';

function ReportGenerator() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  // We'll store an object with both the blob URL and filename.
  const [reportData, setReportData] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch all employees (users with role 'employee')
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('/api/admin/employees', { withCredentials: true });
        // Filter only employees
        const employeeList = res.data.filter(user => user.role === 'employee');
        setEmployees(employeeList);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployees();
  }, []);

  const generateReport = async () => {
    if (!selectedEmployee) {
      setMessage('Please select an employee');
      return;
    }
    console.log("Generating report for employee:", selectedEmployee);
    try {
      // Get the report blob along with headers
      const res = await axios.get(`/api/admin/reports?employeeId=${selectedEmployee}`, {
        responseType: 'blob',
        withCredentials: true,
      });
      
      // Extract filename from Content-Disposition header
      let filename = 'Report.csv';
      const disposition = res.headers['content-disposition'];
      if (disposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      
      // Create a blob URL
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
      setReportData({ url, filename });
      setMessage('');
    } catch (err) {
      console.error(err);
      setMessage('Error generating report');
    }
  };

  return (
    <div>
      <h3>Generate Report</h3>
      {message && <p>{message}</p>}
      <div>
        <label>Select Employee: </label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">-- Select an Employee --</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>
              {emp.username}
            </option>
          ))}
        </select>
        <button onClick={generateReport}>Generate Report</button>
      </div>
      {reportData && (
        <div>
          {/* Use the filename from the response as the download attribute */}
          <a href={reportData.url} download={reportData.filename}>
            Download Report
          </a>
        </div>
      )}
    </div>
  );
}

export default ReportGenerator;
