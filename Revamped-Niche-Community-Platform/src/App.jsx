import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DiscussionBoard from "./components/DiscussionBoard"; // Path to your DiscussionBoard component
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Notifications from "./components/Notifications";
import Leaderboard from "./components/Leaderboard";
import LivePolls from "./components/LivePolls";
import { AuthProvider } from "./context/AuthContext";
import { CommunityProvider } from "./hooks/useCommunityData";
import ProtectedRoute from "./components/ProtectedRoute"; // Ensure this component is implemented correctly

function App() {
  return (
    <AuthProvider>
      <CommunityProvider>
        <Router>
          <div className="app-container" style={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="main-content" style={{ flex: 1, marginLeft: "250px" }}>
              {/* Fixed Navbar */}
              <Navbar />

              {/* Main content with margin top to account for the fixed Navbar */}
              <div style={{ marginTop: "60px" }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<SignUp />} />

                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                  <Route path="/leaderboard" element={<Leaderboard />} />

                  {/* Other Routes */}
                  <Route path="/communities" element={<Community />} />
                  <Route path="/community/:id" element={<Community />} /> {/* Dynamic community route */}

                  {/* Handle Discussions */}
                  <Route path="/discussions/:communityId/:threadId?" element={<DiscussionBoard />} />

                  {/* Default Route */}
                  <Route path="/" element={<Dashboard />} /> {/* This is your fallback route */}
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </CommunityProvider>
    </AuthProvider>
  );
}

export default App;
