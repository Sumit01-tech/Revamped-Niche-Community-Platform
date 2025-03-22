import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { votePost } from '../redux/slices/votingSlice';
import { HStack, IconButton, Text } from '@chakra-ui/react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa'; // Importing thumbs-up and thumbs-down icons

const VotingSystem = ({ postId }) => {
    const dispatch = useDispatch();

    // Fetching the current votes for the post from the Redux store
    const votes = useSelector((state) => state.voting.votes[postId] || { upvotes: 0, downvotes: 0 });

    // Handle upvote
    const handleUpvote = () => {
        dispatch(votePost({ postId, voteType: 'upvote' }));
    };

    // Handle downvote
    const handleDownvote = () => {
        dispatch(votePost({ postId, voteType: 'downvote' }));
    };

    return (
        <HStack>
            <IconButton
                icon={<FaThumbsUp />}
                colorScheme="green"
                onClick={handleUpvote}
                aria-label="Upvote"
            />
            <Text>{votes.upvotes}</Text>

            <IconButton
                icon={<FaThumbsDown />}
                colorScheme="red"
                onClick={handleDownvote}
                aria-label="Downvote"
            />
            <Text>{votes.downvotes}</Text>
        </HStack>
    );
};

export default VotingSystem;
