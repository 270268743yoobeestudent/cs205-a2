import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/GlobalStyles.css";

// Page components
import LoginPage from "./pages/LoginPage";
import WelcomePage from "./pages/WelcomePage"; // Welcome page for default route
import TrainingModulesPage from "./pages/TrainingModulesPage";
import TrainingModuleDetailPage from "./pages/TrainingModuleDetailPage";
import AdminHomePage from "./pages/AdminHomePage";
import EmployeeHomePage from "./pages/EmployeeHomePage"; // For employee dashboard
import AdminAddModulePage from "./pages/AdminAddModulePage"; // Admin add module form
import AdminEditModulePage from "./pages/AdminEditModulePage"; // Admin edit module form
import QuizListPage from "./pages/QuizListPage"; // List of quizzes
import QuizDetailPage from "./pages/QuizDetailPage"; // Taking quizzes
import AdminAddQuizPage from "./pages/AdminAddQuizPage"; // Admin add quiz form
import AdminEditQuizPage from "./pages/AdminEditQuizPage"; // Admin edit quiz form
import EmployeeProgressPage from "./pages/EmployeeProgressPage"; // Progress tracking page
import AdminReportsPage from "./pages/AdminReportsPage"; // Admin reports page
import AdminAddUserPage from "./pages/AdminAddUserPage"; // Add User page for admins

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<WelcomePage />} />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        {/* Training Modules */}
        <Route
          path="/training-modules"
          element={
            <ProtectedRoute allowedRoles={["admin", "employee"]}>
              <TrainingModulesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training-modules/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "employee"]}>
              <TrainingModuleDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-home"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminHomePage />
            </ProtectedRoute>
          }
        />

        {/* Employee Dashboard */}
        <Route
          path="/employee-home"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeHomePage />
            </ProtectedRoute>
          }
        />

        {/* Training Module Management */}
        <Route
          path="/admin/add-module"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAddModulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-module/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminEditModulePage />
            </ProtectedRoute>
          }
        />

        {/* Quiz Management */}
        <Route
          path="/quizzes"
          element={
            <ProtectedRoute allowedRoles={["admin", "employee"]}>
              <QuizListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "employee"]}>
              <QuizDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-quiz"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAddQuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-quiz/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminEditQuizPage />
            </ProtectedRoute>
          }
        />

        {/* Employee Progress */}
        <Route
          path="/employee-progress"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeProgressPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Reports */}
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminReportsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Add User */}
        <Route
          path="/admin/add-user"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAddUserPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
