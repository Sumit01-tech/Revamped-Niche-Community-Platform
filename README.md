# Revamped Niche Community Platform
# Introduction
The Revamped Niche Community Platform is designed to connect users with like-minded individuals through interactive discussion boards, real-time updates, and smart recommendations. This platform fosters engagement by allowing users to participate in niche communities, share insights, and collaborate effectively.

# Project Type
Frontend

# Deployed App
Frontend: Deployed Link

# Directory Structure
📂 Revamped-Niche-Community-Platform
├── 📂 public
│   ├── logo.jpg
│   ├── vite.svg
├── 📂 src
│   ├── 📂 assets
│   │   ├── logo.png 
│   ├── 📂 components
│   │   ├── CommunityList.jsx
│   │   ├── DiscussionBoard.jsx
│   │   ├── Feed.jsx
│   │   ├── LivePolls.jsx
│   │   ├── Navbar.jsx
│   │   ├── Notifications.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Thread.jsx
│   │   ├── VotingSystem.jsx
│   │   ├── CommunityFilters.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── ProfileCustomization.jsx
│   │   ├── Achievements.jsx
│   │   ├── ProtectedRoute.jsx 
│   ├── 📂 context
│   │   ├── AuthContext.jsx
│   │   ├── CommunityContext.jsx
│   ├── 📂 hooks
│   │   ├── useAuth.js
│   │   ├── useCommunityData.js
│   ├── 📂 pages
│   │   ├── Community.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── ProfileSettings.jsx
│   │   ├── Profile.jsx  
│   │   ├── SingleDiscussion.jsx  
│   ├── 📂 redux
│   │   ├── store.js 
│   │   ├── 📂 slices
│   │   │   ├── authSlice.js
│   │   │   ├── communitySlice.js
│   │   │   ├── postSlice.js
│   │   │   ├── notificationsSlice.js
│   │   │   ├── votingSlice.js
│   │   │   ├── feedSlice.js  
│   │   │   ├── discussionSlice.js  
│   │   ├── 📂 selectors
│   │   │   ├── votesSelector.js  
│   ├── 📂 services
│   │   ├── firebase.js
│   │   ├── api.js
│   │── App.css  
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── vite.config.js
├── README.md

# Features
🗨️ Threaded Discussion Boards – Users can engage in conversations with replies and rich-text formatting.

🔄 Real-Time Updates – New posts and comments appear instantly.

🏆 Voting & Polls – Users can vote on discussions and participate in polls.

🎭 Personalized Feed – Users receive customized content recommendations.

🔍 Community Filters – Easily find relevant communities using smart filters.

🔔 Push Notifications – Get notified about replies, mentions, and trending topics.

🎨 Chakra UI Icons – Enhanced navigation with a user-friendly sidebar.

🚀 Optimized Performance – Uses React.memo, useCallback, and useMemo.

🔐 Secure Authentication – Firebase Auth ensures secure login and access control.

# Design Decisions & Assumptions
Optimized UI for responsiveness across all screen sizes.

Firestore used for real-time data updates with well-defined security rules.

State management handled using Context API for better maintainability.

Community clustering implemented to group related communities together.

# Installation & Getting Started
Follow these steps to run the project locally:

Step 1: npm create vite@latest

Step 2: Select React

Step 3 : Select JavaScript

Step 4 : Create Name of the Project followed by same project package

Step 5: cd Revamped-Niche-Community-Platform (project name)

Step 6: npm install

Step 7: npm run dev

# Clone the repository
git clone https://github.com/Sumit01-tech/B43_WEB_154_Web-Project-149.git

# Navigate to the project folder
cd Revamped-Niche-Community-Platform

# Install dependencies
npm install

# Start the development server
npm run dev

# Usage
After running the app, users can:

Sign up / Log in using Firebase Authentication.

Join communities based on interests.

Start discussions with rich-text formatting and media embeds.

Vote on posts and participate in polls.

Filter communities using smart search options.

# Credentials
For demo purposes, use:

makefile
Email: demo@example.com  
Password: demo123  

# APIs Used
Firebase Authentication – Secure user login/logout

Firestore Database – Real-time data storage

WebSocket API – Live updates for discussions

# Technology Stack
Frontend: React, Vite, Chakra UI

State Management: Context API

Database & Auth: Firebase (Firestore + Authentication)

Performance Optimization: React.memo, useMemo, useCallback

UI Enhancements: Chakra UI, Icons, Custom Logo

# Future Enhancements
📢 AI-Powered Moderation – Auto-detect spam or inappropriate content.

🎙️ Live Q&A Sessions – Community members can host live discussions.

📱 Mobile App Version – Build a React Native version for mobile users.

This README provides all essential details for users and developers. Let me know if you need any modifications! 🚀