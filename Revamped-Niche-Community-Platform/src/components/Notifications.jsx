import React, { useEffect, useState, useCallback } from "react";
import { Box, Text, VStack, HStack, Avatar, Icon, Badge, Spinner, Center, Input, Button } from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import { db, rtdb } from "../services/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from "firebase/firestore";
import { ref, push, get, set } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchNotificationsStart,
    fetchNotificationsSuccess,
    fetchNotificationsFailure
} from "../redux/slices/notificationsSlice";

const Notifications = () => {
    const dispatch = useDispatch();
    const notifications = useSelector(state => state.notifications.notifications);
    const isLoading = useSelector(state => state.notifications.isLoading);
    const error = useSelector(state => state.notifications.error);
    const [message, setMessage] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

    const fetchFirestoreNotifications = useCallback(async () => {
        try {
            const notificationsQuery = query(collection(db, "notifications"), orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(notificationsQuery);
            const firestoreData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log("Firestore Notifications:", firestoreData);
            return firestoreData;
        } catch (error) {
            console.error("❌ Error fetching Firestore notifications:", error);
            return [];
        }
    }, []);

    const fetchRealtimeNotifications = useCallback(async () => {
        try {
            const snapshot = await get(ref(rtdb, "notifications"));
            if (snapshot.exists()) {
                const realtimeData = Object.keys(snapshot.val()).map(key => ({
                    id: key,
                    ...snapshot.val()[key],
                }));
                console.log("Realtime Database Notifications:", realtimeData);
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

    const fetchNotifications = useCallback(async () => {
        dispatch(fetchNotificationsStart());
        console.log("Fetching notifications...");
        try {
            const [firestoreData, realtimeData] = await Promise.all([
                fetchFirestoreNotifications(),
                fetchRealtimeNotifications(),
            ]);

            const combinedNotifications = [...firestoreData, ...realtimeData].sort(
                (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
            );

            console.log("✅ Combined Notifications:", combinedNotifications);
            dispatch(fetchNotificationsSuccess(combinedNotifications));
        } catch (error) {
            console.error("❌ Error fetching notifications:", error);
            dispatch(fetchNotificationsFailure(error.message));
        }
    }, [dispatch, fetchFirestoreNotifications, fetchRealtimeNotifications]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const addFirestoreNotification = async () => {
        if (!message || !avatarUrl) return;

        try {
            await addDoc(collection(db, "notifications"), {
                message,
                timestamp: serverTimestamp(),
                userAvatar: avatarUrl,
            });
            console.log("Notification added to Firestore!");
            fetchNotifications();
            setMessage("");
            setAvatarUrl("");
        } catch (e) {
            console.error("Error adding notification to Firestore: ", e);
        }
    };

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
            fetchNotifications();
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
