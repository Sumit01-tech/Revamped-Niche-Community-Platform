import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Avatar,
    Text,
    VStack,
    HStack,
    Button,
    Input,
    Textarea,
    Spinner,
    Center,
    FormControl,
    FormLabel,
    useToast,
} from "@chakra-ui/react";
import { db } from "../services/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { logout } from "../redux/slices/authSlice";

const Profile = () => {
    const dispatch = useDispatch();
    const { user, loading: authLoading } = useSelector((state) => state.auth);
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        displayName: "",
        bio: "",
        photoURL: "",
    });
    const [editing, setEditing] = useState(false);
    const [updating, setUpdating] = useState(false);
    const toast = useToast();

    // Fetch profile data from Firestore
    const fetchProfile = useCallback(async () => {
        if (!user) {
            console.log("No user logged in");
            return;
        }

        console.log("Fetching profile for user UID:", user.uid);

        setUpdating(true);
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                console.log("User profile fetched:", userDoc.data());
                setProfile(userDoc.data());
                setFormData({
                    displayName: userDoc.data().displayName || "",
                    bio: userDoc.data().bio || "",
                    photoURL: userDoc.data().photoURL || "",
                });
            } else {
                console.log("No profile found for user");
                toast({
                    title: "No profile found.",
                    description: "This user does not have a profile in the system.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });

                // Create a new profile in Firestore since it doesn't exist
                await setDoc(doc(db, "users", user.uid), {
                    displayName: user.displayName || "New User",
                    bio: "",
                    photoURL: user.photoURL || "",
                    createdAt: new Date(),
                });
                fetchProfile(); // Re-fetch profile data after creation
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast({
                title: "Error fetching profile",
                description: error.message || "An error occurred while fetching profile data.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
        setUpdating(false);
    }, [user, toast]);

    useEffect(() => {
        // Only fetch profile if user is available and auth is done (authLoading = false)
        if (!authLoading && user) {
            fetchProfile();
        }
    }, [user, authLoading, fetchProfile]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        setUpdating(true);
        try {
            await updateDoc(doc(db, "users", user.uid), formData);
            setProfile((prev) => ({ ...prev, ...formData }));
            setEditing(false);
            toast({
                title: "Profile updated successfully!",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                title: "Error updating profile",
                description: error.message || "An error occurred while updating profile data.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
        setUpdating(false);
    };

    const handleUpdateProfile = async () => {
        if (!formData.displayName) {
            toast({
                title: "Display Name is required.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setUpdating(true);
        try {
            await updateProfile(user, { displayName: formData.displayName, photoURL: formData.photoURL });
            toast({
                title: "Profile updated successfully!",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error updating profile.",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout()); // Dispatch logout action to update Redux state
    };

    // Show spinner if the profile is still loading
    if (authLoading || !profile) {
        return (
            <Center h="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    return (
        <Box p={5} borderWidth="1px" borderRadius="lg" boxShadow="md" bg="white">
            <VStack spacing={4} align="stretch">
                <HStack spacing={4}>
                    <Avatar size="xl" src={profile.photoURL || ""} />
                    <VStack align="start">
                        {!editing ? (
                            <>
                                <Text fontSize="2xl" fontWeight="bold">
                                    {profile.displayName || "User"}
                                </Text>
                                <Text fontSize="md" color="gray.600">
                                    {profile.bio || "No bio available"}
                                </Text>
                            </>
                        ) : (
                            <>
                                <FormControl>
                                    <FormLabel>Profile Picture URL</FormLabel>
                                    <Input
                                        name="photoURL"
                                        value={formData.photoURL}
                                        onChange={handleChange}
                                        placeholder="Enter profile picture URL"
                                    />
                                </FormControl>
                                <Input
                                    name="displayName"
                                    value={formData.displayName}
                                    onChange={handleChange}
                                    placeholder="Enter your display name"
                                />
                                <Textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Enter a short bio"
                                />
                            </>
                        )}
                    </VStack>
                </HStack>

                {editing ? (
                    <HStack>
                        <Button colorScheme="blue" onClick={handleSaveProfile}>
                            Save
                        </Button>
                        <Button colorScheme="gray" onClick={() => setEditing(false)}>
                            Cancel
                        </Button>
                    </HStack>
                ) : (
                    <Button colorScheme="blue" onClick={() => setEditing(true)}>
                        Edit Profile
                    </Button>
                )}

                {!editing && (
                    <Button colorScheme="teal" onClick={handleUpdateProfile}>
                        Save Changes
                    </Button>
                )}

                {/* Add the Logout Button */}
                <Button colorScheme="red" onClick={handleLogout}>
                    Logout
                </Button>
            </VStack>
        </Box>
    );
};

export default React.memo(Profile);
