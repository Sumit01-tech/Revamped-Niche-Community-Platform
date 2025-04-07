import React, { useState, useMemo, useCallback } from "react";
import { Box, Input, Select, VStack, Button, HStack, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommunities } from "../redux/slices/communitySlice";

const CommunityFilters = () => {
    const dispatch = useDispatch();
    const categories = ["All", "Technology", "Health", "Books", "Gaming", "Fitness"];
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("popularity");

    const allCommunities = useSelector((state) => state.community.communities) || [];

    const filteredCommunities = useMemo(() => {
        if (!Array.isArray(allCommunities)) return [];

        let filtered = [...allCommunities];

        if (selectedCategory !== "All") {
            filtered = filtered.filter((community) => community.category === selectedCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter((community) =>
                community.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (sortBy === "popularity") {
            filtered = filtered.sort((a, b) => b.members - a.members);
        } else if (sortBy === "recent") {
            filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return filtered;
    }, [allCommunities, selectedCategory, searchQuery, sortBy]);

    const handleFilterChange = useCallback(() => {
        // Dispatch the action to fetch communities after applying the filters
        dispatch(fetchCommunities({
            category: selectedCategory,
            search: searchQuery,
            sort: sortBy
        }));
    }, [dispatch, selectedCategory, searchQuery, sortBy]);

    return (
        <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" bg="white">
            <Text fontSize="lg" fontWeight="bold" mb={3}>Filter Communities</Text>
            <VStack spacing={3} align="stretch">
                <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </Select>

                <Input
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="popularity">Most Popular</option>
                    <option value="recent">Recently Created</option>
                </Select>

                <HStack>
                    <Button colorScheme="blue" onClick={handleFilterChange}>Fetch Communities</Button>
                    <Button colorScheme="gray" onClick={() => {
                        setSelectedCategory("All");
                        setSearchQuery("");
                        setSortBy("popularity");
                        handleFilterChange();
                    }}>
                        Reset
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default React.memo(CommunityFilters);
