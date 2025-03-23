import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button, Input, VStack, Text } from "@chakra-ui/react";
import { db } from "../services/firebase";
import { doc, updateDoc } from "firebase/firestore";

const ProfileCustomization = () => {
    const { user } = useAuth();
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSave = async () => {
        console.log("User:", user);
        console.log("Bio:", bio);

        if (!user) {
            setError("User is not authenticated");
            return;
        }

        if (!bio.trim()) {
            setError("Bio cannot be empty");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await updateDoc(doc(db, "users", user.uid), {
                bio: bio,
            });
            console.log("Bio saved:", bio);
        } catch (error) {
            console.error("Error saving bio:", error);
            setError("An error occurred while saving the bio");
        }
        setLoading(false);
    };

    if (!user) {
        return <Text>User is not authenticated. Please log in.</Text>;
    }

    return (
        <VStack spacing={4}>
            <Input
                placeholder="Enter bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                isDisabled={loading}
            />
            {error && <Text color="red.500">{error}</Text>}
            <Button
                onClick={handleSave}
                colorScheme="blue"
                isLoading={loading}
                isDisabled={loading}
            >
                Save
            </Button>
        </VStack>
    );
};

export default ProfileCustomization;
