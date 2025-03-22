import { useState, useEffect, useContext, createContext } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

// Create Auth Context
const AuthContext = createContext();

// Custom Hook to use Auth
export const useAuth = () => {
    return useContext(AuthContext);
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Handle user authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Auth state changed. Current user:", currentUser);  // Debugging log
            setUser(currentUser);
            setLoading(false);
        });

        // Clean up subscription when the component is unmounted
        return () => unsubscribe();
    }, []);

    // Sign in with Google
    const login = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    // Logout Function
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    // Provide auth data (user, login, logout) to the context
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {/* Only render children when loading is complete */}
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );
};
