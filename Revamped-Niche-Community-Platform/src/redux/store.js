import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import communityReducer from "./slices/communitySlice";
import postReducer from "./slices/postSlice";
import notificationsReducer from "./slices/notificationsSlice";
import votingReducer from "./slices/votingSlice";
import discussionReducer from "./slices/discussionSlice";
import feedReducer from "./slices/feedSlice";

const store = configureStore({
    reducer: {
        feed: feedReducer,
        discussions: discussionReducer,
        auth: authReducer,
        community: communityReducer,
        posts: postReducer,
        notifications: notificationsReducer,
        voting: votingReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore non-serializable values in the auth.user path and actions involving communities and feeds
                ignoredActions: [
                    'auth/loginSuccess', // Ignore this action for serializability check
                    'community/fetchCommunities/pending',
                    'feed/fetch/pending',
                    'community/fetchCommunities/fulfilled',
                    'feed/fetch/fulfilled',
                ],
                ignoredPaths: ['auth.user'], // Ignore `auth.user` path for serialization checks
            },
        }),
});

export default store;
