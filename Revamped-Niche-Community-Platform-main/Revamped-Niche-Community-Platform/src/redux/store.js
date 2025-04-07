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
                ignoredActions: [
                    'auth/loginSuccess',
                    'community/fetchCommunities/pending',
                    'feed/fetch/pending',
                    'community/fetchCommunities/fulfilled',
                    'feed/fetch/fulfilled',
                ],
                ignoredPaths: ['auth.user'],
            },
        }),
});

export default store;
