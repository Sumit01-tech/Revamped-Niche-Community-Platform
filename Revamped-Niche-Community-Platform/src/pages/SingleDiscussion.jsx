import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Text, Spinner, Textarea } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { votePost, addReply } from "../redux/slices/votingSlice"; // Combined import
import { makeSelectVotesByPostId } from "../redux/selectors/votesSelector"; // Memoized selector

const SingleDiscussion = () => {
    const { threadId } = useParams(); // Get the threadId from the URL
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState(""); // State for managing the reply input
    const [replies, setReplies] = useState([]); // State to manage the list of replies

    // Memoized selector for votes using the threadId
    const votes = useSelector((state) => makeSelectVotesByPostId(threadId)(state));

    // Log the votes object for debugging
    console.log("Votes for threadId:", threadId, votes);

    // Get replies from Redux state
    const currentReplies = useSelector((state) => state.voting.replies[threadId]) || [];

    // Update replies once the component mounts or threadId changes
    useEffect(() => {
        setLoading(false); // Simulate loading state completion
        setReplies(currentReplies); // Update local replies
    }, [threadId, currentReplies]); // Dependencies: threadId, currentReplies

    const handleUpvote = () => {
        console.log("Upvote clicked for threadId:", threadId);
        dispatch(votePost({ postId: threadId, voteType: "upvote" }));
    };

    const handleDownvote = () => {
        console.log("Downvote clicked for threadId:", threadId);
        dispatch(votePost({ postId: threadId, voteType: "downvote" }));
    };

    const handleReplySubmit = () => {
        if (replyText.trim()) {
            // Dispatch action to add the reply to Redux
            dispatch(addReply({ postId: threadId, replyText }));

            // After submitting, clear the input field
            setReplyText("");

            // Optionally, update local replies state (optimistic UI)
            setReplies((prevReplies) => [
                ...prevReplies,
                { id: new Date().getTime(), text: replyText }, // Generate ID based on timestamp
            ]);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={5}>
                <Spinner size="lg" />
            </Box>
        );
    }

    return (
        <Box p={4}>
            <Text fontSize="2xl">Discussion on Thread #{threadId}</Text>

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
                <Button onClick={handleUpvote}>👍 Upvote</Button>
                <Text>{votes ? votes.upvotes : 0} Likes | {votes ? votes.downvotes : 0} Dislikes</Text>
                <Button onClick={handleDownvote}>👎 Downvote</Button>
            </Box>

            {/* Reply Section */}
            <Box mt={5}>
                <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    size="sm"
                />
                <Button
                    mt={2}
                    colorScheme="blue"
                    onClick={handleReplySubmit}
                    isDisabled={!replyText.trim()}
                >
                    Submit Reply
                </Button>
            </Box>

            {/* Display Replies */}
            <Box mt={5}>
                <Text fontSize="xl">Replies:</Text>
                {replies.length === 0 ? (
                    <Text>No replies yet. Be the first to reply!</Text>
                ) : (
                    replies.map((reply) => (
                        <Box key={reply.id} mt={2} borderWidth="1px" p={3}>
                            <Text>{reply.text}</Text>
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default SingleDiscussion;
