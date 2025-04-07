import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Text,
    VStack,
    HStack,
    Avatar,
    Badge,
    Spinner,
    Divider,
} from "@chakra-ui/react";
import { db } from "../services/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const Leaderboard = () => {
    const { user, loading: authLoading } = useAuth();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(false);

    console.log("Authenticated User:", user);

    const fetchLeaderboard = useCallback(async () => {
        setLoading(true);
        try {
            if (!user) {
                throw new Error("User not authenticated");
            }

            console.log("Fetching leaderboard data...");

            const leaderboardQuery = query(
                collection(db, "leaderboard"),
                orderBy("points", "desc")
            );
            const querySnapshot = await getDocs(leaderboardQuery);

            console.log("Fetched Documents:", querySnapshot.docs);
            console.log("Snapshot empty:", querySnapshot.empty);

            if (querySnapshot.empty) {
                console.log("No documents found in leaderboard.");
            } else {
                querySnapshot.docs.forEach(doc => {
                    console.log(doc.id, " => ", doc.data());
                });
            }

            const users = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setLeaders(users);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        if (!authLoading && user) {
            fetchLeaderboard();
        }
    }, [fetchLeaderboard, user, authLoading]);

    if (authLoading || loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={5}>
                <Spinner size="lg" />
            </Box>
        );
    }

    return (
        <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" bg="white">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
                Community Leaderboard
            </Text>
            <VStack spacing={3} align="stretch">
                {leaders.length === 0 ? (
                    <Text>No top contributors yet.</Text>
                ) : (
                    leaders.map((user, index) => (
                        <HStack key={user.id} p={3} borderWidth="1px" borderRadius="md" boxShadow="sm">
                            <Avatar size="sm" src={user.avatar || ""} />
                            <Box flex="1">
                                <Text fontSize="md" fontWeight="bold">
                                    {user.name}
                                </Text>
                                <Badge colorScheme="blue" fontSize="xs">
                                    {user.points} Points
                                </Badge>
                            </Box>
                            <Badge colorScheme={index === 0 ? "yellow" : "gray"}>{index + 1}</Badge>
                        </HStack>
                    ))
                )}
            </VStack>
            <Divider my={4} />
            <Text fontSize="sm" color="gray.500">
                *Leaderboard is based on user engagement and points.
            </Text>
        </Box>
    );
};

export default React.memo(Leaderboard);
