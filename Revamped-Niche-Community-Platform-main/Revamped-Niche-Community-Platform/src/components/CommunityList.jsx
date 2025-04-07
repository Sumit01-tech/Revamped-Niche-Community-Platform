import React, { useState } from "react";
import { Box, Text, VStack, HStack, Badge, Button, useToast } from "@chakra-ui/react";

const CommunityList = ({ communities }) => {
    const [joinedCommunities, setJoinedCommunities] = useState({});

    const toast = useToast();

    const handleJoinCommunity = (communityId, communityName) => {
        if (joinedCommunities[communityId]) {
            toast({
                title: `You have already joined the ${communityName} community.`,
                status: "info",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        setJoinedCommunities((prevState) => ({
            ...prevState,
            [communityId]: true,
        }));
        toast({
            title: `Successfully joined the ${communityName} community!`,
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" bg="white">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
                Available Communities
            </Text>
            {communities.length === 0 ? (
                <Text>No communities available. Create one!</Text>
            ) : (
                <VStack spacing={4} align="stretch">
                    {communities.map((community, index) => {
                        const communityId = community.id || index;

                        return (
                            <HStack
                                key={communityId}
                                p={3}
                                borderWidth="1px"
                                borderRadius="md"
                                boxShadow="sm"
                                justify="space-between"
                            >
                                <Box>
                                    <Text fontSize="lg" fontWeight="bold">
                                        {community.name}
                                    </Text>
                                    <Badge colorScheme="blue">{community.category}</Badge>
                                    <Text fontSize="sm" mt={1}>{community.description}</Text>
                                </Box>
                                <Button
                                    size="sm"
                                    colorScheme="teal"
                                    onClick={() => handleJoinCommunity(communityId, community.name)}
                                    disabled={joinedCommunities[communityId]}
                                >
                                    {joinedCommunities[communityId] ? "Joined" : "Join"}
                                </Button>
                            </HStack>
                        );
                    })}
                </VStack>
            )}
        </Box>
    );
};

export default React.memo(CommunityList);
