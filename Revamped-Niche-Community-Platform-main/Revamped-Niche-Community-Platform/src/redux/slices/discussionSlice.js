import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../services/firebase";
import { collection, getDocs, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";

export const fetchDiscussions = createAsyncThunk(
    "discussions/fetch",
    async (communityId) => {
        try {
            console.log("Fetching discussions for community:", communityId);
            const querySnapshot = await getDocs(collection(db, "communities", communityId, "discussions"));
            const discussions = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            console.log("Fetched discussions:", discussions);
            return discussions;
        } catch (error) {
            console.error("Error fetching discussions:", error);
            throw error;
        }
    }
);

export const addDiscussion = createAsyncThunk(
    "discussions/add",
    async (discussionData) => {
        try {
            const docRef = await addDoc(
                collection(db, "communities", discussionData.communityId, "discussions"),
                {
                    ...discussionData,
                    timestamp: serverTimestamp(),
                    votes: { upvotes: 0, downvotes: 0 },
                    reactions: { thumbsUp: 0, thumbsDown: 0 }
                }
            );
            return { id: docRef.id, ...discussionData };
        } catch (error) {
            console.error("Error adding discussion:", error);
            throw error;
        }
    }
);

export const voteDiscussion = createAsyncThunk(
    "discussions/vote",
    async ({ discussionId, voteType }, { getState }) => {
        const state = getState();
        const discussion = state.discussions.discussions.find(d => d.id === discussionId);

        if (!discussion) {
            throw new Error("Discussion not found");
        }

        try {
            const docRef = doc(db, "communities", discussion.communityId, "discussions", discussionId);

            const updatedVotes = {
                ...discussion.votes,
                [voteType]: discussion.votes[voteType] + 1,
            };
            await updateDoc(docRef, { votes: updatedVotes });
            return { discussionId, updatedVotes };
        } catch (error) {
            console.error("Error voting discussion:", error);
            throw error;
        }
    }
);

export const reactToDiscussion = createAsyncThunk(
    "discussions/react",
    async ({ discussionId, reactionType }, { getState }) => {
        const state = getState();
        const discussion = state.discussions.discussions.find(d => d.id === discussionId);

        if (!discussion) {
            throw new Error("Discussion not found");
        }
        try {
            const docRef = doc(db, "communities", discussion.communityId, "discussions", discussionId);
            const updatedReactions = { ...discussion.reactions };
            if (reactionType === "thumbsUp") {
                updatedReactions.thumbsUp += 1;
            } else if (reactionType === "thumbsDown") {
                updatedReactions.thumbsDown += 1;
            }
            await updateDoc(docRef, { reactions: updatedReactions });
            return { discussionId, updatedReactions };
        } catch (error) {
            console.error("Error reacting to discussion:", error);
            throw error;
        }
    }
);

const discussionSlice = createSlice({
    name: "discussions",
    initialState: {
        discussions: [],
        status: "idle",
        error: null,
        votes: {},
        reactions: {}
    },
    reducers: {
        setDiscussions(state, action) {
            state.discussions = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDiscussions.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchDiscussions.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.discussions = action.payload;
                console.log("Discussions updated in Redux:", action.payload);
            })
            .addCase(fetchDiscussions.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                console.error("Failed to fetch discussions:", action.error.message);
            })
            .addCase(addDiscussion.fulfilled, (state, action) => {
                state.discussions.push(action.payload);
                console.log("Added new discussion:", action.payload);
            })
            .addCase(voteDiscussion.fulfilled, (state, action) => {
                const { discussionId, updatedVotes } = action.payload;
                const index = state.discussions.findIndex(d => d.id === discussionId);
                if (index >= 0) {
                    state.discussions[index].votes = updatedVotes;
                }
            })
            .addCase(reactToDiscussion.fulfilled, (state, action) => {
                const { discussionId, updatedReactions } = action.payload;
                const index = state.discussions.findIndex(d => d.id === discussionId);
                if (index >= 0) {
                    state.discussions[index].reactions = updatedReactions;
                }
            });
    },
});

export default discussionSlice.reducer;
export const { setDiscussions } = discussionSlice.actions;
