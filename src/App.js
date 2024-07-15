import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import './App.css'; 
import UserManagement from "./userManagement";
import LeaveApplication from "./leaveApplication";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app">
          <header className="header">Rogers Copilot</header>
          <div className="button-container">
            <Link to="/addUser">
              <button>Add User</button>
            </Link>
            <Link to="/leaveApplication">
              <button>Leave Application</button>
            </Link>
          </div>
          <Routes>
            <Route path="/addUser" element={<UserManagement />} />
            <Route path="/leaveApplication" element={<LeaveApplication />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
