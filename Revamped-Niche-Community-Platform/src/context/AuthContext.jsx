import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../services/firebase"; // Ensure correct import path
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    updateProfile,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore"; // Import Firestore functions

// Create Auth Context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true); // Start loading until we have the result

            if (currentUser) {
                // Simply set the user without auto-creating profile in Firestore
                setUser({
                    ...currentUser,
                    displayName: currentUser.displayName || currentUser.email.split("@")[0],
                });
            } else {
                setUser(null); // No user, so set it to null
            }

            setLoading(false); // End loading once the auth state is determined
        });

        return () => unsubscribe(); // Cleanup listener when component unmounts
    }, []); // Empty dependency array ensures it runs only once when component mounts

    // Google login function
    const login = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Only set user data in state, not in Firestore yet
            setUser({
                ...user,
                displayName: user.displayName || user.email.split('@')[0], // Set display name
            });
        } catch (error) {
            console.error("Login failed:", error.message);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null); // Reset user state on logout
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

    // Provide the authentication context
    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children} {/* Only render children once loading is false */}
        </AuthContext.Provider>
    );
};

// Custom hook to access Auth context
export const useAuth = () => useContext(AuthContext);
