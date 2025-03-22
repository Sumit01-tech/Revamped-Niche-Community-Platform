// src/redux/selectors/votesSelector.js
import { createSelector } from 'reselect';

// Selector to get votes from Redux state (for a specific postId)
const selectVotesByPostId = (state, postId) => state.voting.votes && state.voting.votes[postId];

// Memoized selector for votes by postId
// src/redux/selectors/votesSelector.js

// Selector to access the votes directly from the state for a specific postId
export const makeSelectVotesByPostId = (postId) => (state) =>
    state.voting.votes ? state.voting.votes[postId] : { upvotes: 0, downvotes: 0 };

// Selector for getting reactions from the state (reactions to posts)
export const getReactionsByPostId = (state, postId) =>
    state.voting.reactions ? state.voting.reactions[postId] : { thumbsUp: 0, thumbsDown: 0 };

// Memoized selector for reactions
export const getReactionsMemoized = createSelector(
    [getReactionsByPostId],
    (reactions) => reactions || { thumbsUp: 0, thumbsDown: 0 } // Default empty reactions if not present
);
