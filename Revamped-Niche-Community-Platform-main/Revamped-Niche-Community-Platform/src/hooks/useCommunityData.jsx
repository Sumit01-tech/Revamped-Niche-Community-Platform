import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { db } from "../services/firebase";
import {
    collection,
    getDocs,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";

const CommunityContext = createContext();

export const useCommunityData = () => {
    const context = useContext(CommunityContext);
    if (!context) {
        throw new Error("useCommunityData must be used within a CommunityProvider");
    }
    return context;
};

export const CommunityProvider = ({ children }) => {
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCommunities = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            console.log("📡 Fetching communities...");

            if (!db) throw new Error("Firestore is not initialized!");

            const querySnapshot = await getDocs(collection(db, "communities"));
            const communityList = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    lastActive: data.lastActive?.toDate ? data.lastActive.toDate().toISOString() : "Unknown",
                };
            });

            console.log("✅ Fetched communities:", communityList);
            setCommunities(communityList);
        } catch (error) {
            console.error("🔥 Error fetching communities:", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCommunities();
    }, [fetchCommunities]);

    const addCommunity = useCallback(async (name, description) => {
        setLoading(true);
        setError(null);

        try {
            console.log("➕ Adding community:", name);

            const communityData = {
                name,
                description,
                membersCount: 1,
                lastActive: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, "communities"), communityData);
            console.log("✅ Community added:", docRef.id);

            fetchCommunities();
        } catch (error) {
            console.error("🔥 Error adding community:", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [fetchCommunities]);

    return (
        <CommunityContext.Provider value={{ communities, addCommunity, loading, error }}>
            {children}
        </CommunityContext.Provider>
    );
};
