import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../services/firebase";

// Async thunk to fetch feed data
export const fetchFeed = createAsyncThunk("feed/fetch", async () => {
    const querySnapshot = await getDocs(query(collection(db, "feeds"), orderBy("timestamp", "desc")));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});

// Redux slice
const feedSlice = createSlice({
    name: "feed",
    initialState: { data: [], status: "idle", error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeed.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchFeed.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload; // Ensure data is replaced with fresh data
            })
            .addCase(fetchFeed.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default feedSlice.reducer;
