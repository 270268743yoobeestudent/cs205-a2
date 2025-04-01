# Cybersecurity Training Web Application

## Table of Contents:

- Overview
- Features
- Dependencies
- Prerequisites
- Installation
- Configuration
- Running the Application
- Usage
- Project Structure
- Troubleshooting
- License

---

## Overview

This application is a full-stack Cybersecurity Training Web Application built using Node.js/Express, MongoDB (with Mongoose), and React. It supports role-based authentication, providing separate dashboards for administrators and employees. Key features include employee and content management, quiz management, progress tracking, and report generation.

---

## Features

- **Session-Based Authentication:** Secure login with sessions stored in MongoDB.
- **Admin Dashboard:**
  - **Employee Management:** Create, update, and delete employee accounts (with secure password handling and self-deletion protection).
  - **Module Management:** Create training modules with a title and multiple content sections; edit and delete modules.
  - **Quiz Management:** Create quizzes with a title, associate them with modules, add questions with options and correct answers, and set passing scores; edit and delete quizzes.
  - **Report Generation:** Generate CSV reports that compile employee progress, including module completion and quiz scores.
- **Employee Dashboard:**
  - **Training Modules:** View available training modules, read detailed content sections, and mark modules as completed.
  - **Quizzes:** View available quizzes (displaying quiz title, associated module, and passing score) and attempt them.
  - **Personal Progress:** View overall progress, including completed modules and highest quiz scores.
- **Welcome Page:** A polished landing page is displayed before the login screen.
- **Environment Configuration:** Sensitive configuration data (e.g., MongoDB URI, session secret) is stored in an `.env` file.

---

## Dependencies

To run this application, you need:

- **Node.js** (v14 or later recommended)
- **npm** (comes with Node.js)
- **MongoDB Atlas** (or a local MongoDB instance)
- **Git**
- **Visual Studio Code** (recommended for development; install extensions like ESLint, Prettier, and dotenv support)

The project uses the following npm packages (installed locally as dependencies):

### Backend Dependencies:

- express
- express-session
- mongoose
- connect-mongo
- dotenv
- cors
- body-parser

### Frontend Dependencies:

- react
- react-dom
- react-router-dom
- axios
- react-scripts  
(Plus any additional packages listed in `frontend/package.json`)

---

## Prerequisites

Ensure you have Node.js, npm, and Git installed. Also, create a MongoDB Atlas account or set up a local MongoDB instance.

---

## Installation

### a. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/270268743yoobeestudent/cs205-a2.git
cd cs205-a2
```
Or download the ZIP folder from above

### b. Install Backend Dependencies

Navigate to the backend folder:

```bash
cd backend
npm install
```

### c. Install Frontend Dependencies

Open a new terminal tab or window, navigate to the frontend folder, and run:

```bash
cd frontend
npm install
```

---

## Configuration

### a. Environment Variables

In the backend folder, create a file named `.env` (if it doesn't exist) and add the following content. Replace the placeholder values with your actual credentials:

```
PORT=5000
MONGO_URI=mongodb+srv://anthony:yourActualPassword@cs205-a2.lqx6x.mongodb.net/yourDatabaseName?retryWrites=true&w=majority
SESSION_SECRET=yourSecretKey
FRONTEND_ORIGIN=http://localhost:3000
```

- **MONGO_URI:** Replace `yourActualPassword` with your MongoDB password and `yourDatabaseName` with the name of your database.
- **SESSION_SECRET:** Use a strong secret string.
- **FRONTEND_ORIGIN:** Should match your frontend URL.

### b. .gitignore

Ensure that your `.env` file is included in your `.gitignore` to keep your credentials secure.

---

## Running the Application

### a. Start the Backend

Open a terminal in the backend directory and run:

```bash
npm start
```

The backend server will connect to MongoDB and run on the port specified in your `.env` file (default is 5000).

### b. Start the Frontend

Open another terminal in the frontend directory and run:

```bash
npm start
```

The React application will open in your browser at [http://localhost:3000](http://localhost:3000).

---

## Usage

- **Welcome Page:**  
  When you navigate to [http://localhost:3000](http://localhost:3000), you will see a welcome page with a "Continue to Login" button.
- **Login:**  
  The default credentials for this application are:

  Username: admin

  Password: admin123

  After logging in with this default account, you can then create new users as you see fit.
  
- **Admin Dashboard:**
  - **Employee Management:** Manage employee accounts.
  - **Module Management:** Create, edit, and delete training modules with multiple content sections.
  - **Quiz Management:** Create, edit, and delete quizzes; quizzes include a title and are associated with modules.
  - **Report Generation:** Generate CSV reports detailing module completion and quiz scores.
- **Employee Dashboard:**
  - **Training Modules:** View modules, read content, and mark modules as completed.
  - **Quizzes:** View available quizzes and attempt them.
  - **Personal Progress:** View overall progress, including completed modules and quiz scores.

---

## Project Structure

```
cs205-a2/
├── backend/
│   ├── controllers/
│   │   ├── adminController.js
│   │   └── employeeController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── TrainingModule.js
│   │   ├── Quiz.js
│   │   └── UserProgress.js
│   ├── routes/
│   │   ├── Auth.js
│   │   ├── admin.js
│   │   └── employee.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Welcome.js
│   │   │   ├── Login.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── EmployeeDashboard.js
│   │   │   ├── ModuleManagement.js
│   │   │   ├── QuizManagement.js
│   │   │   ├── PersonalProgress.js
│   │   │   ├── TrainingModuleViewer.js
│   │   │   ├── EmployeeQuizList.js
│   │   │   └── EmployeeQuizAttempt.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── ... other frontend files
└── README.md
```

---

## Troubleshooting

- **MongoDB Connection & Authentication:**  
  Verify your MONGO_URI, credentials, and that your IP is whitelisted in your Atlas cluster.
- **Session Persistence & CORS:**  
  Ensure your backend's session and CORS configurations are correct. Make sure axios requests include `{ withCredentials: true }`.
- **CSV Report Download:**  
  If the CSV file shows an unexpected icon, verify the filename in your Downloads folder. The file should end with `.csv` and contain valid CSV data.
- **General Application Errors:**  
  Check both the backend and browser console logs for error messages to diagnose issues with API calls, data fetching, or session handling.

---

## License

This project is provided for educational purposes and can be modified or expanded as needed for your organization's training needs.
