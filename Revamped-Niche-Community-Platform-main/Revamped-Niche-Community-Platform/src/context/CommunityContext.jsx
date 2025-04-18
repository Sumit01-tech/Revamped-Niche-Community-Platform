import React, { createContext, useState, useEffect, useContext } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

const CommunityContext = createContext();

export const useCommunity = () => {
    const context = useContext(CommunityContext);
    if (!context) {
        throw new Error("useCommunity must be used within a CommunityProvider");
    }
    return context;
};

export const CommunityProvider = ({ children }) => {
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                console.log("Fetching communities...");

                if (!db) {
                    throw new Error("Firestore is not initialized!");
                }

                const querySnapshot = await getDocs(collection(db, "communities"));
                const communityList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log("Fetched communities:", communityList);
                setCommunities(communityList);
            } catch (err) {
                console.error("Error fetching communities:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCommunities();
    }, []);

    const addCommunity = async (newCommunity) => {
        try {
            const docRef = await addDoc(collection(db, "communities"), newCommunity);
            setCommunities((prev) => [...prev, { id: docRef.id, ...newCommunity }]);
        } catch (error) {
            console.error("Error adding community:", error);
            setError(error.message);
        }
    };

    const updateCommunity = async (id, updatedData) => {
        try {
            const communityRef = doc(db, "communities", id);
            await updateDoc(communityRef, updatedData);
            setCommunities((prev) =>
                prev.map((community) =>
                    community.id === id ? { ...community, ...updatedData } : community
                )
            );
        } catch (error) {
            console.error("Error updating community:", error);
            setError(error.message);
        }
    };

    const deleteCommunity = async (id) => {
        try {
            await deleteDoc(doc(db, "communities", id));
            setCommunities((prev) => prev.filter((community) => community.id !== id));
        } catch (error) {
            console.error("Error deleting community:", error);
            setError(error.message);
        }
    };

    return (
        <CommunityContext.Provider
            value={{ communities, addCommunity, updateCommunity, deleteCommunity, loading, error }}
        >
            {children}
        </CommunityContext.Provider>
    );
};
