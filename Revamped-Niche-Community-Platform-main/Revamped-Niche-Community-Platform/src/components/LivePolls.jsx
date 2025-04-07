import { useState } from "react";
import { db } from "../services/firebase";
import { addDoc, collection } from "firebase/firestore";
import { Button, Input, VStack, Text, Stack, FormLabel, Select, useToast } from "@chakra-ui/react";

const LivePolls = () => {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([]);
    const [pollType, setPollType] = useState("multiple");
    const [successMessage, setSuccessMessage] = useState("");
    const toast = useToast();

    const handleAddOption = () => {
        setOptions((prevOptions) => [...prevOptions, ""]);
    };

    const handleOptionChange = (e, idx) => {
        const newOptions = [...options];
        newOptions[idx] = e.target.value;
        setOptions(newOptions);
    };

    const handleRemoveOption = (idx) => {
        const newOptions = options.filter((_, index) => index !== idx);
        setOptions(newOptions);
    };

    const handleAddPoll = async () => {
        if (!question.trim()) {
            alert("Please enter a question!");
            return;
        }

        if (options.some(option => !option.trim())) {
            alert("Please provide valid options!");
            return;
        }

        await addDoc(collection(db, "polls"), {
            question,
            options,
            votes: new Array(options.length).fill(0),
            pollType,
        });

        toast({
            title: "Poll Created Successfully",
            description: "Your poll has been created and is ready to be shared.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });

        setQuestion("");
        setOptions([]);
        setSuccessMessage("Poll created successfully!");
    };

    return (
        <VStack spacing={4} align="stretch">
            <Text fontSize="xl" fontWeight="bold">Create a Poll</Text>

            {/* Poll Title */}
            <Input
                placeholder="Enter your poll question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />

            {/* Poll Type Selection */}
            <FormLabel>Poll Type</FormLabel>
            <Select
                value={pollType}
                onChange={(e) => setPollType(e.target.value)}
                placeholder="Select Poll Type"
            >
                <option value="multiple">Multiple Choice (One Option)</option>
                <option value="multiple-selection">Multiple Selection (Choose More Than One)</option>
            </Select>

            {/* Render Options Based on Poll Type */}
            <Text fontWeight="semibold" mt={2}>Poll Options</Text>

            {/* If poll type is "multiple", show only one option */}
            {pollType === "multiple" ? (
                <Stack direction="row" spacing={2} key={0}>
                    <Input
                        placeholder={`Option 1`}
                        value={options[0] || ""}
                        onChange={(e) => handleOptionChange(e, 0)}
                    />
                </Stack>
            ) : (
                options.map((opt, idx) => (
                    <Stack direction="row" spacing={2} key={idx}>
                        <Input
                            placeholder={`Option ${idx + 1}`}
                            value={opt}
                            onChange={(e) => handleOptionChange(e, idx)}
                        />
                        <Button
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleRemoveOption(idx)}
                        >
                            Remove
                        </Button>
                    </Stack>
                ))
            )}

            {/* Button to Add More Options, only available for "multiple-selection" poll type */}
            {pollType === "multiple-selection" && (
                <Button colorScheme="blue" onClick={handleAddOption}>
                    Add More Options
                </Button>
            )}

            {/* Button to Create Poll */}
            <Button colorScheme="green" onClick={handleAddPoll}>
                Create Poll
            </Button>

            {/* Optional Success Message */}
            {successMessage && <Text color="green.500" fontSize="lg">{successMessage}</Text>}
        </VStack>
    );
};

export default LivePolls;
