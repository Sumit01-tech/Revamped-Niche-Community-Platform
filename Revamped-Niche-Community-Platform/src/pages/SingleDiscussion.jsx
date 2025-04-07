import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Text, Spinner, Textarea } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { votePost, addReply } from "../redux/slices/votingSlice";
import { makeSelectVotesByPostId } from "../redux/selectors/votesSelector";

const SingleDiscussion = () => {
    const { threadId } = useParams();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState("");
    const [replies, setReplies] = useState([]);

    const votes = useSelector((state) => makeSelectVotesByPostId(threadId)(state));

    console.log("Votes for threadId:", threadId, votes);

    const currentReplies = useSelector((state) => state.voting.replies[threadId]) || [];

    useEffect(() => {
        setLoading(false);
        setReplies(currentReplies);
    }, [threadId, currentReplies]);

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
            dispatch(addReply({ postId: threadId, replyText }));
            setReplyText("");
            setReplies((prevReplies) => [
                ...prevReplies,
                { id: new Date().getTime(), text: replyText },
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
