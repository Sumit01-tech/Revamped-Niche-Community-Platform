import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Box, Text, VStack, Icon, Tooltip } from "@chakra-ui/react";
import { FaMedal, FaTrophy, FaStar } from "react-icons/fa";

const achievementsList = [
    { title: "Newcomer", condition: (posts) => posts < 5, icon: FaStar },
    { title: "Contributor", condition: (posts) => posts >= 5 && posts < 20, icon: FaMedal },
    { title: "Expert", condition: (posts) => posts >= 20, icon: FaTrophy },
];

const Achievement = () => {
    const userPosts = useSelector((state) => state.posts.userPosts || []);
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        const userAchievement = achievementsList.filter((achievement) =>
            achievement.condition(userPosts.length)
        );
        setAchievements(userAchievement);
    }, [userPosts]);

    const memoizedAchievements = useMemo(() => achievements, [achievements]);

    return (
        <Box p={5} borderWidth="1px" borderRadius="lg" boxShadow="md" bg="gray.50">
            <Text fontSize="xl" fontWeight="bold" mb={3}>
                🎖 Your Achievements
            </Text>
            <VStack spacing={3} align="center">
                {memoizedAchievements.length > 0 ? (
                    memoizedAchievements.map((achieve, index) => (
                        <Tooltip key={index} label={achieve.title} aria-label="Achievement tooltip">
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                p={3}
                                bg="white"
                                borderRadius="full"
                                boxShadow="sm"
                            >
                                <Icon as={achieve.icon} color="gold" w={6} h={6} />
                                <Text ml={2} fontSize="md" fontWeight="medium">
                                    {achieve.title}
                                </Text>
                            </Box>
                        </Tooltip>
                    ))
                ) : (
                    <Text fontSize="md" color="gray.600">
                        Keep engaging to earn your first achievement!
                    </Text>
                )}
            </VStack>
        </Box>
    );
};

export default React.memo(Achievement);
