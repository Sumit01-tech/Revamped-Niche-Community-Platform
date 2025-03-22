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
            // Ensure action.payload contains an array of notifications
            state.notifications = action.payload;
            state.isLoading = false;
        },
        fetchNotificationsFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        addNotification: (state, action) => {
            // Add new notification at the top of the list
            state.notifications.unshift(action.payload);
        },
        markAsRead: (state, action) => {
            // Mark the notification as read
            state.notifications = state.notifications.map((notif) =>
                notif.id === action.payload ? { ...notif, read: true } : notif
            );
        },
        clearNotifications: (state) => {
            // Optionally clear notifications
            state.notifications = [];
        },
    },
});

// Export actions
export const {
    fetchNotificationsStart,
    fetchNotificationsSuccess,
    fetchNotificationsFailure,
    addNotification,
    markAsRead,
    clearNotifications,
} = notificationsSlice.actions;

// Export reducer
export default notificationsSlice.reducer;
