import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming you're using context for auth

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth(); // Fetch user data and loading state from context

    useEffect(() => {
        console.log('Auth state changed:', user); // Debugging: Log the user state for debugging purposes
    }, [user, loading]);

    if (loading) {
        // Optionally show a loading spinner or screen while auth is loading
        return <div>Loading...</div>;
    }

    if (!user) {
        // Redirect to login page if user is not authenticated
        return <Navigate to="/login" />;
    }

    return children; // Render the children if authenticated
};

export default ProtectedRoute;
