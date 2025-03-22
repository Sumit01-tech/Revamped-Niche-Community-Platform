import { useAuth } from "../context/AuthContext";
import {
    Box, Heading, Text, VStack, HStack, Spinner, SimpleGrid, Divider, Badge, Flex, Button
} from "@chakra-ui/react";  // Add Button here
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CommunityFilters from "../components/CommunityFilters";
import LivePolls from "../components/LivePolls";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [communities, setCommunities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(() => {
        setTimeout(() => {
            setCommunities([
                { id: 1, name: "Tech Enthusiasts", description: "A place for tech lovers", membersCount: 350 },
                { id: 2, name: "Tech Innovators Hub", description: "Discuss latest tech trends, AI, Web3, and innovations.", membersCount: 500 },
            ]);
            setLoading(false);
        }, 2000);
    }, []);

    return (
        <VStack spacing={6} align="stretch" p={5} mt="80px">
            {/* Header */}
            <Box textAlign="center">
                <Heading size="lg">
                    Welcome, {user?.displayName || user?.email.split("@")[0] || "Guest"}!
                </Heading>
                <Text color="gray.500">Explore communities and engage with posts.</Text>
            </Box>

            {/* 🔹 Balanced Row: Filter Communities & Create Poll */}
            <SimpleGrid columns={[1, 1, 2]} spacing={6}>
                <CommunityFilters />
                <LivePolls /> {/* ✅ Moved next to filters for proper alignment */}
            </SimpleGrid>

            {/* 🔹 Main Section: Community Feed & Trending Discussions */}
            <SimpleGrid columns={[1, 1, 2]} spacing={8}>
                {/* ✅ Left Column: Community Feed */}
                <Flex direction="column" flex="1" minH="full">
                    <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="md" flex="1">
                        <Heading size="md" mb={3}>Community Feed</Heading>
                        <Divider mb={4} />
                        {loading ? (
                            <Box textAlign="center" py={10}>
                                <Spinner size="xl" />
                            </Box>
                        ) : (
                            communities.map((community) => (
                                <Box key={community.id} p={3} mb={3} borderWidth="1px" borderRadius="md" boxShadow="sm" _hover={{ shadow: "lg" }}>
                                    <Heading size="sm">{community.name}</Heading>
                                    <Text fontSize="sm">{community.description}</Text>
                                    <Badge colorScheme="purple">Members: {community.membersCount}</Badge>
                                </Box>
                            ))
                        )}
                        {/* Remove the Logout Button as per your request */}
                        {/* <Button mt={3} colorScheme="green">Refresh Feed</Button> */}
                    </Box>
                </Flex>

                {/* ✅ Right Column: Trending Discussions */}
                <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="md" flex="1">
                    <Heading size="md" mb={3}>Trending Discussions</Heading>
                    <Divider mb={4} />
                    <VStack spacing={3} align="stretch">
                        <Box p={3} borderWidth="1px" borderRadius="md" boxShadow="sm">
                            <Heading size="sm">Latest React Features</Heading>
                            <Text fontSize="sm">Discussion on React Server Components.</Text>
                        </Box>
                        <Box p={3} borderWidth="1px" borderRadius="md" boxShadow="sm">
                            <Heading size="sm">AI in Web Development</Heading>
                            <Text fontSize="sm">Exploring AI-powered UI tools.</Text>
                        </Box>
                        <Box p={3} borderWidth="1px" borderRadius="md" boxShadow="sm">
                            <Heading size="sm">Best Frontend Frameworks</Heading>
                            <Text fontSize="sm">Comparing React, Vue, and Svelte.</Text>
                        </Box>
                    </VStack>
                </Box>
            </SimpleGrid>
        </VStack>
    );
};

export default Dashboard;
