import React from "react";
import { Link } from "react-router-dom";
import { VStack, Box, Text, IconButton, Divider } from "@chakra-ui/react";
import { FaHome, FaUsers, FaComments, FaBell, FaTrophy, FaUser } from "react-icons/fa";

const Sidebar = ({ communityId }) => {
    return (
        <Box
            w="250px"
            h="100vh"
            bg="gray.100"
            p={4}
            boxShadow="lg"
            position="fixed"
            left={0}
            top={0}
            display="flex"
            flexDirection="column"
        >
            <Text fontSize="2xl" fontWeight="bold" mb={5} textAlign="center">
                Community Hub
            </Text>
            <VStack spacing={4} align="stretch">
                <Link to="/">
                    <Box
                        p={3}
                        borderRadius="md"
                        _hover={{ bg: "gray.200" }}
                        display="flex"
                        alignItems="center"
                    >
                        <IconButton
                            icon={<FaHome />}
                            aria-label="Home"
                            variant="ghost"
                            mr={3}
                        />
                        <Text>Home</Text>
                    </Box>
                </Link>

                <Link to="/communities">
                    <Box
                        p={3}
                        borderRadius="md"
                        _hover={{ bg: "gray.200" }}
                        display="flex"
                        alignItems="center"
                    >
                        <IconButton
                            icon={<FaUsers />}
                            aria-label="Communities"
                            variant="ghost"
                            mr={3}
                        />
                        <Text>Communities</Text>
                    </Box>
                </Link>

                <Link to={`/discussions/${communityId}`}>
                    <Box
                        p={3}
                        borderRadius="md"
                        _hover={{ bg: "gray.200" }}
                        display="flex"
                        alignItems="center"
                    >
                        <IconButton
                            icon={<FaComments />}
                            aria-label="Discussions"
                            variant="ghost"
                            mr={3}
                        />
                        <Text>Discussions</Text>
                    </Box>
                </Link>

                <Link to="/notifications">
                    <Box
                        p={3}
                        borderRadius="md"
                        _hover={{ bg: "gray.200" }}
                        display="flex"
                        alignItems="center"
                    >
                        <IconButton
                            icon={<FaBell />}
                            aria-label="Notifications"
                            variant="ghost"
                            mr={3}
                        />
                        <Text>Notifications</Text>
                    </Box>
                </Link>

                <Link to="/leaderboard">
                    <Box
                        p={3}
                        borderRadius="md"
                        _hover={{ bg: "gray.200" }}
                        display="flex"
                        alignItems="center"
                    >
                        <IconButton
                            icon={<FaTrophy />}
                            aria-label="Leaderboard"
                            variant="ghost"
                            mr={3}
                        />
                        <Text>Leaderboard</Text>
                    </Box>
                </Link>

                <Link to="/profile">
                    <Box
                        p={3}
                        borderRadius="md"
                        _hover={{ bg: "gray.200" }}
                        display="flex"
                        alignItems="center"
                    >
                        <IconButton
                            icon={<FaUser />}
                            aria-label="Profile"
                            variant="ghost"
                            mr={3}
                        />
                        <Text>Profile</Text>
                    </Box>
                </Link>
            </VStack>

            <Divider my={4} />

            <Text fontSize="sm" textAlign="center" color="gray.500">
                © {new Date().getFullYear()} Community Hub
            </Text>
        </Box>
    );
};

export default React.memo(Sidebar);
