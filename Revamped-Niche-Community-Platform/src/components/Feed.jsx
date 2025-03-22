import React, { useEffect } from "react";
import {
    Box,
    Text,
    VStack,
    Spinner,
    Divider,
    Badge,
    HStack,
    Button,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFeed } from "../redux/slices/feedSlice";
import { fetchCommunities } from "../redux/slices/communitySlice"; // Assuming fetchCommunities is exported

const Feed = () => {
    const dispatch = useDispatch();
    const { feedPosts, loading: feedLoading, error: feedError } = useSelector((state) => state.feed);
    const { communities, loading: communityLoading, error: communityError } = useSelector((state) => state.community);

    useEffect(() => {
        dispatch(fetchFeed());
        dispatch(fetchCommunities()); // Ensure communities are fetched after filter is applied
    }, [dispatch]);

    const handleRefreshFeed = () => {
        dispatch(fetchFeed());
        dispatch(fetchCommunities()); // Refresh filtered communities on refresh
    };

    if (communityLoading || feedLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={5}>
                <Spinner size="lg" />
            </Box>
        );
    }

    if (feedError) {
        return (
            <Box p={4}>
                <Text color="red.500">{`Error loading feed: ${feedError}`}</Text>
            </Box>
        );
    }

    if (communityError) {
        return (
            <Box p={4}>
                <Text color="red.500">{`Error loading communities: ${communityError}`}</Text>
            </Box>
        );
    }

    return (
        <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" bg="white">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
                Community Feed
            </Text>

            {/* Community List */}
            <VStack spacing={4} align="stretch">
                <Text fontSize="lg" fontWeight="semibold">Communities</Text>
                {communities?.length === 0 ? (
                    <Text>No communities found.</Text>
                ) : (
                    communities.map((community) => (
                        <HStack key={community.id} p={3} borderWidth="1px" borderRadius="md" boxShadow="sm">
                            <Box flex="1">
                                <Text fontSize="md" fontWeight="bold">{community.name}</Text>
                                <Text fontSize="sm">{community.description}</Text>
                            </Box>
                        </HStack>
                    ))
                )}
            </VStack>

            <Divider my={4} />

            {/* Feed Posts */}
            <VStack spacing={4} align="stretch">
                <Text fontSize="lg" fontWeight="semibold">Recent Activity</Text>
                {feedPosts?.length === 0 ? (
                    <Text>No recent activity yet.</Text>
                ) : (
                    feedPosts.map((post) => (
                        <HStack key={post.id} p={3} borderWidth="1px" borderRadius="md" boxShadow="sm">
                            <Box flex="1">
                                <Text fontSize="md">{post.content}</Text>
                                <Badge colorScheme="green" fontSize="xs">
                                    {post.createdAt?.toDate?.()?.toLocaleString()}
                                </Badge>
                            </Box>
                        </HStack>
                    ))
                )}
            </VStack>

            <Divider my={4} />

            <Button colorScheme="teal" size="sm" onClick={handleRefreshFeed}>
                Refresh Feed
            </Button>
        </Box>
    );
};

export default React.memo(Feed);
