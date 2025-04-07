import React, { useState, useEffect, useCallback } from "react";
import { Box, Text, VStack, HStack, Button, Textarea, Spinner, Divider } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDiscussions, addDiscussion, voteDiscussion } from "../redux/slices/discussionSlice";
import { db } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Link, useParams, useNavigate } from "react-router-dom";
import SingleDiscussion from "../pages/SingleDiscussion";

const DiscussionBoard = () => {
    const { communityId, threadId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { discussions, status, error } = useSelector((state) => state.discussions || {});
    const [newPost, setNewPost] = useState("");
    const [fetching, setFetching] = useState(false);

    const addDiscussionToFirestore = async (communityId, content) => {
        try {
            const docRef = await addDoc(collection(db, "communities", communityId, "discussions"), {
                content,
                createdAt: serverTimestamp(),
                upvotes: 0,
                downvotes: 0,
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding discussion:", error);
            throw error;
        }
    };

    const fetchDiscussionData = useCallback(() => {
        if (!communityId) return;
        setFetching(true);
        dispatch(fetchDiscussions(communityId))
            .then(() => setFetching(false))
            .catch((error) => {
                setFetching(false);
                console.error("Error fetching discussions:", error);
            });
    }, [communityId, dispatch]);

    useEffect(() => {
        fetchDiscussionData();
    }, [fetchDiscussionData]);

    const handleAddPost = async () => {
        if (!newPost.trim() || !communityId) return;

        try {
            const newDiscussionId = await addDiscussionToFirestore(communityId, newPost);

            const newDiscussion = { content: newPost, communityId, createdAt: serverTimestamp(), id: newDiscussionId };
            dispatch(addDiscussion(newDiscussion));
            setNewPost("")
        } catch (error) {
            console.error("Error adding discussion:", error);
        }
    };

    const handleVote = (discussionId, voteType) => {
        dispatch(voteDiscussion({ discussionId, voteType }));
    };

    useEffect(() => {
        if (!threadId && discussions.length > 0) {
            navigate(`/discussions/${communityId}/${discussions[0].id}`);
        }
    }, [threadId, discussions, navigate, communityId]);

    if (fetching || status === "loading") {
        return <Spinner size="lg" />;
    }

    if (status === "failed" || error) {
        return <Text color="red.500">Error: {error || "Failed to fetch discussions"}</Text>;
    }

    return (
        <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" bg="white">
            {threadId ? (
                <SingleDiscussion threadId={threadId} communityId={communityId} />
            ) : (
                <Box>
                    <Text fontSize="xl" fontWeight="bold" mb={4}>Discussion Board</Text>
                    <VStack spacing={4} align="stretch">
                        <Box>
                            <Textarea placeholder="Start a discussion..." value={newPost} onChange={(e) => setNewPost(e.target.value)} size="sm" mb={2} />
                            <Button colorScheme="teal" size="sm" onClick={handleAddPost}>Post</Button>
                        </Box>
                        <Divider />
                        {discussions.length === 0 ? (
                            <Text>No discussions yet. Start the first one!</Text>
                        ) : (
                            discussions.map((discussion) => (
                                <HStack key={discussion.id} p={3} borderWidth="1px" borderRadius="md" boxShadow="sm">
                                    <Box flex="1">
                                        <Text fontSize="md">{discussion.content}</Text>
                                        <Link to={`/discussions/${communityId}/${discussion.id}`}>
                                            <Button variant="link" colorScheme="blue" size="sm">View Discussion</Button>
                                        </Link>

                                        <Text mt={2}>
                                            Upvotes: {discussion.upvotes} | Downvotes: {discussion.downvotes}
                                        </Text>

                                        <Box mt={2}>
                                            <Button
                                                colorScheme="blue"
                                                onClick={() => handleVote(discussion.id, "upvote")}
                                                mr={3}
                                            >
                                                Upvote
                                            </Button>
                                            <Button
                                                colorScheme="red"
                                                onClick={() => handleVote(discussion.id, "downvote")}
                                            >
                                                Downvote
                                            </Button>
                                        </Box>
                                    </Box>
                                </HStack>
                            ))
                        )}
                    </VStack>
                </Box>
            )}
        </Box>
    );
};

export default React.memo(DiscussionBoard);
