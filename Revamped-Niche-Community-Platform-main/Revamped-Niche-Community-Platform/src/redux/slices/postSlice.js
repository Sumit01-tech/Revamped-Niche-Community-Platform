import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async (_, { rejectWithValue }) => {
    try {
        const snapshot = await getDocs(collection(db, "posts"));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const addPost = createAsyncThunk("posts/addPost", async (newPost, { rejectWithValue }) => {
    try {
        const docRef = await addDoc(collection(db, "posts"), newPost);
        return { id: docRef.id, ...newPost };
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const updatePost = createAsyncThunk("posts/updatePost", async ({ id, updatedData }, { rejectWithValue }) => {
    try {
        const postRef = doc(db, "posts", id);
        await updateDoc(postRef, updatedData);
        return { id, ...updatedData };
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const deletePost = createAsyncThunk("posts/deletePost", async (postId, { rejectWithValue }) => {
    try {
        await deleteDoc(doc(db, "posts", postId));
        return postId;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const postSlice = createSlice({
    name: "posts",
    initialState: {
        posts: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addPost.fulfilled, (state, action) => {
                state.posts.unshift(action.payload);
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                const index = state.posts.findIndex((post) => post.id === action.payload.id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.posts = state.posts.filter((post) => post.id !== action.payload);
            });
    },
});

export default postSlice.reducer;
