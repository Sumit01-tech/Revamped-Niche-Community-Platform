import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { votePost } from '../redux/slices/votingSlice';
import { HStack, IconButton, Text } from '@chakra-ui/react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const VotingSystem = ({ postId }) => {
    const dispatch = useDispatch();

    const votes = useSelector((state) => state.voting.votes[postId] || { upvotes: 0, downvotes: 0 });

    const handleUpvote = () => {
        dispatch(votePost({ postId, voteType: 'upvote' }));
    };

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
