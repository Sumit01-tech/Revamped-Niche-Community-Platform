import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: [],
    isLoading: false,
    error: null,
};
const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        fetchNotificationsStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        fetchNotificationsSuccess: (state, action) => {
            state.notifications = action.payload;
            state.isLoading = false;
        },
        fetchNotificationsFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
        },
        markAsRead: (state, action) => {
            state.notifications = state.notifications.map((notif) =>
                notif.id === action.payload ? { ...notif, read: true } : notif
            );
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
});

export const {
    fetchNotificationsStart,
    fetchNotificationsSuccess,
    fetchNotificationsFailure,
    addNotification,
    markAsRead,
    clearNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
