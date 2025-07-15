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
import Link2Page from "./pages/Link2";
import Link3Page from "./pages/Link3";
import Link4Page from "./pages/Link4";
import SocketView from "./pages/SocketView";
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
              <SocketView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/link2"
          element={
            <ProtectedRoute>
              <Link2Page />
            </ProtectedRoute>
          }
        />
        <Route
          path="/link3"
          element={
            <ProtectedRoute>
              <Link3Page />
            </ProtectedRoute>
          }
        />
        <Route
          path="/link4"
          element={
            <ProtectedRoute>
              <Link4Page />
            </ProtectedRoute>
          }
        />
        <Route
          path="/socket"
          element={
            <ProtectedRoute>
              <SocketView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
