import React, { useEffect, useState, useCallback } from "react";
import { Box, Text, VStack, HStack, Avatar, Icon, Badge, Spinner, Center, Input, Button } from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import { db, rtdb } from "../services/firebase"; // Import both Firestore & RTDB
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from "firebase/firestore";
import { ref, push, get, set } from "firebase/database"; // RTDB functions
import { useDispatch, useSelector } from "react-redux";
import {
    fetchNotificationsStart,
    fetchNotificationsSuccess,
    fetchNotificationsFailure
} from "../redux/slices/notificationsSlice"; // Import actions

const Notifications = () => {
    const dispatch = useDispatch();
    const notifications = useSelector(state => state.notifications.notifications); // Get notifications from Redux state
    const isLoading = useSelector(state => state.notifications.isLoading);
    const error = useSelector(state => state.notifications.error); // Get error state
    const [message, setMessage] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

    // Fetch Firestore Notifications
    const fetchFirestoreNotifications = useCallback(async () => {
        try {
            const notificationsQuery = query(collection(db, "notifications"), orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(notificationsQuery);
            const firestoreData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log("Firestore Notifications:", firestoreData); // Log fetched Firestore notifications
            return firestoreData;
        } catch (error) {
            console.error("❌ Error fetching Firestore notifications:", error);
            return [];
        }
    }, []);

    // Fetch Realtime Database Notifications
    const fetchRealtimeNotifications = useCallback(async () => {
        try {
            const snapshot = await get(ref(rtdb, "notifications"));
            if (snapshot.exists()) {
                const realtimeData = Object.keys(snapshot.val()).map(key => ({
                    id: key,
                    ...snapshot.val()[key],
                }));
                console.log("Realtime Database Notifications:", realtimeData); // Log fetched RTDB notifications
                return realtimeData;
            } else {
                console.log("No notifications found in RTDB.");
                return [];
            }
        } catch (error) {
            console.error("❌ Error fetching Realtime Database notifications:", error);
            return [];
        }
    }, []);

    // Fetch and combine notifications
    const fetchNotifications = useCallback(async () => {
        dispatch(fetchNotificationsStart());
        console.log("Fetching notifications..."); // Log when fetching notifications starts
        try {
            const [firestoreData, realtimeData] = await Promise.all([
                fetchFirestoreNotifications(),
                fetchRealtimeNotifications(),
            ]);

            // Combine notifications from both Firestore and RTDB
            const combinedNotifications = [...firestoreData, ...realtimeData].sort(
                (a, b) => new Date(b.timestamp) - new Date(a.timestamp) // Sort by timestamp
            );

            console.log("✅ Combined Notifications:", combinedNotifications); // Log merged notifications data
            dispatch(fetchNotificationsSuccess(combinedNotifications)); // Dispatch success action
        } catch (error) {
            console.error("❌ Error fetching notifications:", error);
            dispatch(fetchNotificationsFailure(error.message)); // Dispatch failure action
        }
    }, [dispatch, fetchFirestoreNotifications, fetchRealtimeNotifications]);

    // Fetch notifications when component mounts
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Add Firestore notification
    const addFirestoreNotification = async () => {
        if (!message || !avatarUrl) return;

        try {
            await addDoc(collection(db, "notifications"), {
                message,
                timestamp: serverTimestamp(),
                userAvatar: avatarUrl,
            });
            console.log("Notification added to Firestore!");
            fetchNotifications(); // Re-fetch notifications
            setMessage("");
            setAvatarUrl("");
        } catch (e) {
            console.error("Error adding notification to Firestore: ", e);
        }
    };

    // Add Realtime Database notification
    const addRealtimeNotification = async () => {
        if (!message || !avatarUrl) return;

        try {
            const newNotificationRef = push(ref(rtdb, "notifications"));
            await set(newNotificationRef, {
                message,
                timestamp: new Date().toISOString(),
                userAvatar: avatarUrl,
            });
            console.log("Notification added to Realtime Database!");
            fetchNotifications(); // Re-fetch notifications
            setMessage("");
            setAvatarUrl("");
        } catch (e) {
            console.error("Error adding notification to RTDB: ", e);
        }
    };

    const handleAddNotification = () => {
        addFirestoreNotification();
        addRealtimeNotification();
    };

    if (isLoading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (error) {
        return (
            <Center h="100vh">
                <Text color="red.500">Failed to load notifications: {error}</Text>
            </Center>
        );
    }

    // Log the notifications state from Redux before rendering
    console.log("Notifications from Redux:", notifications);

    return (
        <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" bg="white">
            <HStack mb={4} spacing={2}>
                <Icon as={FaBell} boxSize={6} color="blue.500" />
                <Text fontSize="xl" fontWeight="bold">Notifications</Text>
            </HStack>

            {/* Form to add new notification */}
            <VStack spacing={4} mb={4}>
                <Input placeholder="Enter message" value={message} onChange={(e) => setMessage(e.target.value)} />
                <Input placeholder="Enter avatar URL" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
                <Button onClick={handleAddNotification} colorScheme="blue">Add Notification</Button>
            </VStack>

            {/* Notifications list */}
            <VStack spacing={3} align="stretch">
                {notifications.length === 0 ? (
                    <Text color="gray.500" textAlign="center">No new notifications.</Text>
                ) : (
                    notifications.map((notif) => (
                        <HStack key={notif.id} p={3} borderWidth="1px" borderRadius="md" boxShadow="sm" alignItems="center">
                            <Avatar size="sm" src={notif.userAvatar || ""} />
                            <Box flex="1">
                                <Text fontSize="md" fontWeight="bold">{notif.message}</Text>
                                <Badge colorScheme="gray" fontSize="xs">
                                    {new Date(notif.timestamp).toLocaleString()}
                                </Badge>
                            </Box>
                        </HStack>
                    ))
                )}
            </VStack>
        </Box>
    );
};

export default React.memo(Notifications);
