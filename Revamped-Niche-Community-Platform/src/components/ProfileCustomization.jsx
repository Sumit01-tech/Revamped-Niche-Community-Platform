import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button, Input, VStack, Text } from "@chakra-ui/react";
import { db } from "../services/firebase"; // Ensure correct Firebase instance import
import { doc, updateDoc } from "firebase/firestore";

const ProfileCustomization = () => {
    const { user } = useAuth(); // Get the authenticated user from context
    const [bio, setBio] = useState(""); // State to store bio input
    const [loading, setLoading] = useState(false); // Loading state to indicate saving progress
    const [error, setError] = useState(""); // Error state for handling errors during saving

    // Handle Save bio action
    const handleSave = async () => {
        console.log("User:", user); // Log user details
        console.log("Bio:", bio); // Log the bio input

        if (!user) {
            setError("User is not authenticated");
            return;
        }

        if (!bio.trim()) {
            setError("Bio cannot be empty");
            return;
        }

        setLoading(true);
        setError(""); // Clear previous errors

        try {
            // Update the bio in the Firestore database
            await updateDoc(doc(db, "users", user.uid), {
                bio: bio, // Update the bio field in Firestore
            });
            console.log("Bio saved:", bio);
        } catch (error) {
            console.error("Error saving bio:", error);
            setError("An error occurred while saving the bio");
        }
        setLoading(false); // Reset loading state
    };

    if (!user) {
        return <Text>User is not authenticated. Please log in.</Text>; // Display this if user is not authenticated
    }

    return (
        <VStack spacing={4}>
            <Input
                placeholder="Enter bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                isDisabled={loading} // Disable input while saving
            />
            {error && <Text color="red.500">{error}</Text>} {/* Display error message if any */}
            <Button
                onClick={handleSave}
                colorScheme="blue"
                isLoading={loading} // Show loading spinner while saving
                isDisabled={loading} // Disable button while saving
            >
                Save
            </Button>
        </VStack>
    );
};

export default ProfileCustomization;
