import React, { useState } from "react";
import {
    Box,
    Text,
    VStack,
    HStack,
    Button,
    Divider,
    IconButton,
    Textarea,
    Spinner,
} from "@chakra-ui/react";
import { FaReply, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { voteDiscussion } from "@redux/slices/discussionSlice";

const Thread = ({ thread }) => {
    const dispatch = useDispatch();
    const [replies, setReplies] = useState(thread.replies || []);
    const [newReply, setNewReply] = useState("");

    const handleReply = () => {
        if (newReply.trim() !== "") {
            setReplies([
                ...replies,
                { text: newReply, user: "You", date: new Date().toLocaleString() },
            ]);
            setNewReply("");
        }
    };

    const handleLike = () => {
        dispatch(voteDiscussion({ discussionId: thread.id, voteType: "upvotes" }));
    };

    const handleDislike = () => {
        dispatch(voteDiscussion({ discussionId: thread.id, voteType: "downvotes" }));
    };

    if (!thread) {
        return <Text color="red.500">Thread data not available</Text>;
    }

    return (
        <Box borderWidth="1px" borderRadius="lg" p={4} mb={4} bg="white" boxShadow="sm">
            <Text fontSize="lg" fontWeight="bold">{thread.title}</Text>
            <Text fontSize="sm" color="gray.500">
                Posted by {thread.author || "Unknown"} on {thread.date || "Unknown date"}
            </Text>
            <Text mt={2}>{thread.content}</Text>
            <HStack spacing={4} mt={3}>
                <IconButton
                    icon={<FaThumbsUp />}
                    onClick={handleLike}
                    aria-label="Like"
                    isLoading={thread.status === "loading"}
                />
                <Text>{thread.votes?.upvotes || 0}</Text>
                <IconButton
                    icon={<FaThumbsDown />}
                    onClick={handleDislike}
                    aria-label="Dislike"
                    isLoading={thread.status === "loading"}
                />
                <Text>{thread.votes?.downvotes || 0}</Text>
            </HStack>
            <Divider my={4} />
            <VStack align="stretch" spacing={2}>
                {replies.length === 0 ? (
                    <Text color="gray.500">No replies yet.</Text>
                ) : (
                    replies.map((reply, index) => (
                        <Box key={index} p={2} bg="gray.100" borderRadius="md">
                            <Text fontSize="sm" fontWeight="bold">{reply.user}</Text>
                            <Text fontSize="sm">{reply.text}</Text>
                            <Text fontSize="xs" color="gray.500">{reply.date}</Text>
                        </Box>
                    ))
                )}
            </VStack>
            <HStack mt={3}>
                <Textarea
                    placeholder="Write a reply..."
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    size="sm"
                />
                <Button onClick={handleReply} colorScheme="blue" leftIcon={<FaReply />}>
                    Reply
                </Button>
            </HStack>
        </Box>
    );
};

export default React.memo(Thread);
