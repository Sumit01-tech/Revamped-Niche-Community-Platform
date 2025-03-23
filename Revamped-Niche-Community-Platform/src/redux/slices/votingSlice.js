import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    votes: {},
    replies: {},
};
const votingSlice = createSlice({
    name: 'voting',
    initialState,
    reducers: {
        votePost: (state, action) => {
            const { postId, voteType } = action.payload;

            if (!state.votes[postId]) {
                state.votes[postId] = { upvotes: 0, downvotes: 0 };
            }
            if (voteType === 'upvote') {
                state.votes[postId].upvotes += 1;
            } else if (voteType === 'downvote') {
                state.votes[postId].downvotes += 1;
            }
            console.log('Updated state after votePost:', state.votes);
        },

        addReply: (state, action) => {
            const { postId, replyText } = action.payload;
            const newReply = { id: new Date().getTime(), text: replyText };

            if (!state.replies[postId]) {
                state.replies[postId] = [];
            }
            state.replies[postId].push(newReply);
        },
    },
});

export const { votePost, addReply } = votingSlice.actions;
export default votingSlice.reducer;
