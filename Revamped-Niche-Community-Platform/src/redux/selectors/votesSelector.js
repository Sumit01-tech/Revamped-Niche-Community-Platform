import { createSelector } from 'reselect';

const selectVotesByPostId = (state, postId) => state.voting.votes && state.voting.votes[postId];

export const makeSelectVotesByPostId = (postId) => (state) =>
    state.voting.votes ? state.voting.votes[postId] : { upvotes: 0, downvotes: 0 };

export const getReactionsByPostId = (state, postId) =>
    state.voting.reactions ? state.voting.reactions[postId] : { thumbsUp: 0, thumbsDown: 0 };

export const getReactionsMemoized = createSelector(
    [getReactionsByPostId],
    (reactions) => reactions || { thumbsUp: 0, thumbsDown: 0 }
);
