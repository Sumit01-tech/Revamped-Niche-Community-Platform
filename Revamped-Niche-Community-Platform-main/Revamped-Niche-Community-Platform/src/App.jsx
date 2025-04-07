import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DiscussionBoard from "./components/DiscussionBoard";
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
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <CommunityProvider>
        <Router>
          <div className="app-container" style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <div className="main-content" style={{ flex: 1, marginLeft: "250px" }}>
              <Navbar />
              <div style={{ marginTop: "60px" }}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<SignUp />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/communities" element={<Community />} />
                  <Route path="/community/:id" element={<Community />} />
                  <Route path="/discussions/:communityId/:threadId?" element={<DiscussionBoard />} />
                  <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
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
