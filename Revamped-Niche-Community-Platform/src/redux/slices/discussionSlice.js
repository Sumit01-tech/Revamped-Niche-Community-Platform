import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../services/firebase"; // Ensure this path is correct
import { collection, getDocs, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";

// Async Thunk to Fetch Discussions from Firestore
export const fetchDiscussions = createAsyncThunk(
    "discussions/fetch",
    async (communityId) => {
        try {
            console.log("Fetching discussions for community:", communityId); // Add this to confirm the communityId is correct
            const querySnapshot = await getDocs(collection(db, "communities", communityId, "discussions"));
            const discussions = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            console.log("Fetched discussions:", discussions); // Log the fetched data to confirm
            return discussions;
        } catch (error) {
            console.error("Error fetching discussions:", error);
            throw error;
        }
    }
);

// Async Thunk to Add a New Discussion
export const addDiscussion = createAsyncThunk(
    "discussions/add",
    async (discussionData) => {
        try {
            const docRef = await addDoc(
                collection(db, "communities", discussionData.communityId, "discussions"),
                {
                    ...discussionData,
                    timestamp: serverTimestamp(),
                    votes: { upvotes: 0, downvotes: 0 }, // Initialize votes
                    reactions: { thumbsUp: 0, thumbsDown: 0 } // Initialize reactions
                }
            );
            return { id: docRef.id, ...discussionData }; // Return the newly created discussion data
        } catch (error) {
            console.error("Error adding discussion:", error);
            throw error;
        }
    }
);

// Async Thunk to Update the Vote for a Discussion (upvote/downvote)
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
                [voteType]: discussion.votes[voteType] + 1, // Increment the vote count
            };

            // Update the vote in Firestore
            await updateDoc(docRef, { votes: updatedVotes });

            // Return the updated votes to update the Redux state
            return { discussionId, updatedVotes };
        } catch (error) {
            console.error("Error voting discussion:", error);
            throw error;
        }
    }
);

// Async Thunk to Update Reactions for a Discussion (thumbsUp/thumbsDown)
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

            // Increment the reaction count based on the reactionType (thumbsUp or thumbsDown)
            if (reactionType === "thumbsUp") {
                updatedReactions.thumbsUp += 1;
            } else if (reactionType === "thumbsDown") {
                updatedReactions.thumbsDown += 1;
            }

            // Update the reactions in Firestore
            await updateDoc(docRef, { reactions: updatedReactions });

            // Return the updated reactions to update the Redux state
            return { discussionId, updatedReactions };
        } catch (error) {
            console.error("Error reacting to discussion:", error);
            throw error;
        }
    }
);

// Redux Slice to Manage Discussions State
const discussionSlice = createSlice({
    name: "discussions",
    initialState: {
        discussions: [], // Array to store discussions
        status: "idle", // "idle" | "loading" | "succeeded" | "failed"
        error: null,
        votes: {}, // Store votes by discussionId
        reactions: {} // Store reactions by discussionId
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
                state.discussions.push(action.payload); // This will add the new discussion to Redux
                console.log("Added new discussion:", action.payload);
            })
            .addCase(voteDiscussion.fulfilled, (state, action) => {
                const { discussionId, updatedVotes } = action.payload;
                const index = state.discussions.findIndex(d => d.id === discussionId);
                if (index >= 0) {
                    state.discussions[index].votes = updatedVotes; // Update vote count
                }
            })
            .addCase(reactToDiscussion.fulfilled, (state, action) => {
                const { discussionId, updatedReactions } = action.payload;
                const index = state.discussions.findIndex(d => d.id === discussionId);
                if (index >= 0) {
                    state.discussions[index].reactions = updatedReactions; // Update reactions
                }
            });
    },
});

export default discussionSlice.reducer;
export const { setDiscussions } = discussionSlice.actions;
