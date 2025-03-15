// frontend/src/components/ReportGenerator.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReportGenerator() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [reportUrl, setReportUrl] = useState('');
  const [message, setMessage] = useState('');

  // Fetch all employees (users with role 'employee')
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('/api/admin/employees');
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
      const res = await axios.get(`/api/admin/reports?employeeId=${selectedEmployee}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      setReportUrl(url);
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
      {reportUrl && (
        <div>
          <a href={reportUrl} download>
            Download Report
          </a>
        </div>
      )}
    </div>
  );
}

export default ReportGenerator;
