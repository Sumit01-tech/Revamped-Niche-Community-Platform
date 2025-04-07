import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

export const fetchCommunities = async () => {
    const querySnapshot = await getDocs(collection(db, "communities"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addCommunity = async (communityData) => {
    const docRef = await addDoc(collection(db, "communities"), communityData);
    return { id: docRef.id, ...communityData };
};
export const updateCommunity = async (id, updatedData) => {
    const docRef = doc(db, "communities", id);
    await updateDoc(docRef, updatedData);
    return { id, ...updatedData };
};

export const deleteCommunity = async (id) => {
    const docRef = doc(db, "communities", id);
    await deleteDoc(docRef);
    return id;
};

export const fetchPosts = async (communityId) => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    return querySnapshot.docs
        .filter((doc) => doc.data().communityId === communityId)
        .map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addPost = async (postData) => {
    const docRef = await addDoc(collection(db, "posts"), postData);
    return { id: docRef.id, ...postData };
};

export const updatePost = async (id, updatedData) => {
    const docRef = doc(db, "posts", id);
    await updateDoc(docRef, updatedData);
    return { id, ...updatedData };
};

export const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
    return id;
};

export const fetchNotifications = async () => {
    const querySnapshot = await getDocs(collection(db, "notifications"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addNotification = async (notificationData) => {
    const docRef = await addDoc(collection(db, "notifications"), notificationData);
    return { id: docRef.id, ...notificationData };
};

export const fetchUserProfile = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: userId, ...docSnap.data() };
    } else {
        throw new Error("User not found");
    }
};

export const updateUserProfile = async (userId, updatedData) => {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, updatedData);
    return { id: userId, ...updatedData };
};
