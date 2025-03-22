// communitySlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../services/firebase";

// 🔹 Async thunk to fetch communities from Firestore with filters
export const fetchCommunities = createAsyncThunk(
    "community/fetchCommunities",
    async ({ category, search, sort }, { rejectWithValue }) => {
        try {
            let q = collection(db, "communities");

            // Apply category filter if needed
            if (category !== "All") {
                q = query(q, where("category", "==", category));
            }

            // Apply search query filter if needed
            if (search) {
                q = query(q, where("name", ">=", search), where("name", "<=", search + '\uf8ff'));
            }

            // Apply sorting
            if (sort === "popularity") {
                q = query(q, orderBy("members", "desc"));
            } else if (sort === "recent") {
                q = query(q, orderBy("createdAt", "desc"));
            }

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt ? doc.data().createdAt.toDate().toISOString() : null,
            }));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Initial state for the slice
const initialState = {
    communities: [],
    isLoading: false,
    error: null,
};

const communitySlice = createSlice({
    name: "community",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommunities.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCommunities.fulfilled, (state, action) => {
                state.communities = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchCommunities.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default communitySlice.reducer;
