import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

// Fetch all communities
export const fetchCommunities = async () => {
    const querySnapshot = await getDocs(collection(db, "communities"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Add a new community
export const addCommunity = async (communityData) => {
    const docRef = await addDoc(collection(db, "communities"), communityData);
    return { id: docRef.id, ...communityData };
};

// Update community details
export const updateCommunity = async (id, updatedData) => {
    const docRef = doc(db, "communities", id);
    await updateDoc(docRef, updatedData);
    return { id, ...updatedData };
};

// Delete a community
export const deleteCommunity = async (id) => {
    const docRef = doc(db, "communities", id);
    await deleteDoc(docRef);
    return id;
};

// Fetch posts in a community
export const fetchPosts = async (communityId) => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    return querySnapshot.docs
        .filter((doc) => doc.data().communityId === communityId)
        .map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Add a new post
export const addPost = async (postData) => {
    const docRef = await addDoc(collection(db, "posts"), postData);
    return { id: docRef.id, ...postData };
};

// Update a post
export const updatePost = async (id, updatedData) => {
    const docRef = doc(db, "posts", id);
    await updateDoc(docRef, updatedData);
    return { id, ...updatedData };
};

// Delete a post
export const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
    return id;
};

// Fetch notifications
export const fetchNotifications = async () => {
    const querySnapshot = await getDocs(collection(db, "notifications"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Add a notification
export const addNotification = async (notificationData) => {
    const docRef = await addDoc(collection(db, "notifications"), notificationData);
    return { id: docRef.id, ...notificationData };
};

// Fetch user profile
export const fetchUserProfile = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: userId, ...docSnap.data() };
    } else {
        throw new Error("User not found");
    }
};

// Update user profile
export const updateUserProfile = async (userId, updatedData) => {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, updatedData);
    return { id: userId, ...updatedData };
};
