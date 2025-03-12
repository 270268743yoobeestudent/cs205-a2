import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/GlobalStyles.css"; // Add styles for the reports page

function AdminReportsPage() {
  const [employees, setEmployees] = useState([]); // List of employees
  const [selectedEmployee, setSelectedEmployee] = useState(""); // Selected employee ID
  const [report, setReport] = useState(null); // Report data for the selected employee
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  // Fetch all employees when the component loads
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/users", {
          withCredentials: true,
        });
        setEmployees(response.data.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees.");
      }
    };

    fetchEmployees();
  }, []);

  // Fetch report for the selected employee
  const fetchReport = async (employeeId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/admin/reports/${employeeId}`, {
        withCredentials: true,
      });
      setReport(response.data.data);
      setError(""); // Clear any previous error
    } catch (err) {
      console.error("Error fetching employee report:", err);
      setError("Failed to load employee report.");
    } finally {
      setLoading(false);
    }
  };

  // Handle CSV Export
  const exportToCsv = () => {
    if (!report) {
      alert("No report available to export.");
      return;
    }

    const csvRows = [
      ["Employee Report"],
      [`Name: ${report.employeeId.firstName} ${report.employeeId.lastName}`],
      [`Email: ${report.employeeId.email}`],
      [],
      ["Completed Modules"],
      ...(report.completedModules.map((module) => [module.title])),
      [],
      ["Quiz Scores"],
      ...(report.quizScores.map((quiz) => [quiz.title, `${quiz.score}%`])),
    ];

    // Convert to CSV format
    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Create a link to download the file
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.employeeId.firstName}_${report.employeeId.lastName}_Report.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-reports-page">
      <h1>Employee Reports</h1>
      {error && <div className="error">{error}</div>}

      {/* Select Employee Dropdown */}
      <div className="employee-selection">
        <label htmlFor="employeeSelect">Select Employee:</label>
        <select
          id="employeeSelect"
          value={selectedEmployee}
          onChange={(e) => {
            setSelectedEmployee(e.target.value);
            fetchReport(e.target.value);
          }}
        >
          <option value="">-- Select an Employee --</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.firstName} {employee.lastName}
            </option>
          ))}
        </select>
      </div>

      {/* Show Report Details */}
      {loading ? (
        <div>Loading report...</div>
      ) : report ? (
        <div className="report-details">
          <h2>Report for {report.employeeId.firstName} {report.employeeId.lastName}</h2>
          <p><strong>Email:</strong> {report.employeeId.email}</p>

          <h3>Completed Modules</h3>
          <ul>
            {report.completedModules.length > 0 ? (
              report.completedModules.map((module) => (
                <li key={module._id}>{module.title}</li>
              ))
            ) : (
              <li>No completed modules.</li>
            )}
          </ul>

          <h3>Quiz Scores</h3>
          <ul>
            {report.quizScores.length > 0 ? (
              report.quizScores.map((quiz, index) => (
                <li key={index}>
                  {quiz.title}: {quiz.score}%
                </li>
              ))
            ) : (
              <li>No quiz scores available.</li>
            )}
          </ul>

          {/* Export to CSV Button */}
          <button onClick={exportToCsv}>Export to CSV</button>
        </div>
      ) : (
        <p>Select an employee to view their report.</p>
      )}
    </div>
  );
}

export default AdminReportsPage;
