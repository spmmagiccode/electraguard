import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DataLogsPage from "./pages/DataLogs";
import PredictionsPage from "./pages/Predictions";
import AboutPage from "./pages/About";
import SocketViewPage from "./pages/SocketView";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/SocketView"
          element={
            <ProtectedRoute>
              <SocketViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/DataLogs"
          element={
            <ProtectedRoute>
              <DataLogsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Predictions"
          element={
            <ProtectedRoute>
              <PredictionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/About"
          element={
            <ProtectedRoute>
              <AboutPage />
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </Router>
  );
}

export default App;
