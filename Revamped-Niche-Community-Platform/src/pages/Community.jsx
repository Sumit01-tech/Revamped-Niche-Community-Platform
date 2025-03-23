import React, { useState, useEffect } from "react";
import { Box, Heading, Button, VStack, Spinner, Input, FormControl, FormLabel, Textarea, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Select } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import CommunityList from "../components/CommunityList";

const Community = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [communityName, setCommunityName] = useState("");
    const [communityDescription, setCommunityDescription] = useState("");
    const [communityCategory, setCommunityCategory] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [communities, setCommunities] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            fetchCommunities();
        }
    }, [user, navigate]);

    const fetchCommunities = async () => {
        const querySnapshot = await getDocs(collection(db, "communities"));
        const communitiesList = querySnapshot.docs.map((doc) => doc.data());
        setCommunities(communitiesList);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleCreateCommunity = async () => {
        if (!communityName || !communityDescription || !communityCategory) {
            toast({
                title: "All fields are required.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);

        try {
            await addDoc(collection(db, "communities"), {
                name: communityName,
                description: communityDescription,
                category: communityCategory,
                createdAt: new Date(),
                createdBy: user.uid,
            });
            fetchCommunities();
            setCommunityName("");
            setCommunityDescription("");
            setCommunityCategory("");
            setIsLoading(false);
            closeModal();

            toast({
                title: "Community created successfully!",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            setIsLoading(false);
            toast({
                title: "Error creating community.",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };
    if (!user) {
        return (
            <Box textAlign="center" py={10}>
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <VStack spacing={6} align="stretch" p={5}>
            <Heading size="lg" textAlign="center">
                Explore Communities
            </Heading>

            <Button
                colorScheme="teal"
                onClick={openModal}
                alignSelf="center"
            >
                + Create Community
            </Button>

            <CommunityList communities={communities} />

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create a New Community</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired>
                            <FormLabel>Community Name</FormLabel>
                            <Input
                                type="text"
                                value={communityName}
                                onChange={(e) => setCommunityName(e.target.value)}
                                placeholder="Enter community name"
                            />
                        </FormControl>
                        <FormControl mt={4} isRequired>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                value={communityDescription}
                                onChange={(e) => setCommunityDescription(e.target.value)}
                                placeholder="Enter community description"
                            />
                        </FormControl>
                        <FormControl mt={4} isRequired>
                            <FormLabel>Category</FormLabel>
                            <Select
                                value={communityCategory}
                                onChange={(e) => setCommunityCategory(e.target.value)}
                                placeholder="Select category"
                            >
                                <option value="Technology">Technology</option>
                                <option value="Sports">Sports</option>
                                <option value="Gaming">Gaming</option>
                                <option value="Music">Music</option>
                                <option value="Education">Education</option>
                                <option value="Arts & Crafts">Arts & Crafts</option>
                                <option value="Business & Entrepreneurship">Business & Entrepreneurship</option>
                                <option value="Food & Cooking">Food & Cooking</option>
                                <option value="Health & Wellness">Health & Wellness</option>
                                <option value="Social Causes">Social Causes</option>
                            </Select>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={handleCreateCommunity}
                            isLoading={isLoading}
                            loadingText="Creating..."
                        >
                            Create Community
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
};

export default Community;
