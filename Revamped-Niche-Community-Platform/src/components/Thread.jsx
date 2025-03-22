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
import { useDispatch } from "react-redux";  // Import dispatch from redux
import { voteDiscussion } from "@redux/slices/discussionSlice";  // Import your vote action

const Thread = ({ thread }) => {
    const dispatch = useDispatch(); // Initialize dispatch to trigger voting actions

    // Local state for replies and new reply input
    const [replies, setReplies] = useState(thread.replies || []);
    const [newReply, setNewReply] = useState("");

    // Handle adding a new reply
    const handleReply = () => {
        if (newReply.trim() !== "") {
            setReplies([
                ...replies,
                { text: newReply, user: "You", date: new Date().toLocaleString() },
            ]);
            setNewReply(""); // Clear the input after reply
        }
    };

    // Handle like and dislike actions (dispatch to Redux)
    const handleLike = () => {
        dispatch(voteDiscussion({ discussionId: thread.id, voteType: "upvotes" }));
    };

    const handleDislike = () => {
        dispatch(voteDiscussion({ discussionId: thread.id, voteType: "downvotes" }));
    };

    // Check if the thread data is missing or incomplete
    if (!thread) {
        return <Text color="red.500">Thread data not available</Text>;
    }

    return (
        <Box borderWidth="1px" borderRadius="lg" p={4} mb={4} bg="white" boxShadow="sm">
            {/* Thread Title */}
            <Text fontSize="lg" fontWeight="bold">{thread.title}</Text>

            {/* Thread Meta Information (Author and Date) */}
            <Text fontSize="sm" color="gray.500">
                Posted by {thread.author || "Unknown"} on {thread.date || "Unknown date"}
            </Text>

            {/* Thread Content */}
            <Text mt={2}>{thread.content}</Text>

            {/* Like and Dislike Buttons */}
            <HStack spacing={4} mt={3}>
                <IconButton
                    icon={<FaThumbsUp />}
                    onClick={handleLike}
                    aria-label="Like"
                    isLoading={thread.status === "loading"} // Optional: Display a loading spinner
                />
                <Text>{thread.votes?.upvotes || 0}</Text>
                <IconButton
                    icon={<FaThumbsDown />}
                    onClick={handleDislike}
                    aria-label="Dislike"
                    isLoading={thread.status === "loading"} // Optional: Display a loading spinner
                />
                <Text>{thread.votes?.downvotes || 0}</Text>
            </HStack>

            {/* Divider */}
            <Divider my={4} />

            {/* Display Replies */}
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

            {/* Reply Section */}
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
