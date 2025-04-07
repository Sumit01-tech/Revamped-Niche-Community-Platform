import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Heading,
    Input,
    Button,
    VStack,
    FormControl,
    FormLabel,
    Text,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { loginStart, loginSuccess, loginFailure } from "../redux/slices/authSlice";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignUp = useCallback(async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            setLoading(false);
            return;
        }

        dispatch(loginStart());

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            dispatch(loginSuccess(userCredential.user));

            setSuccess("Account created successfully! Redirecting to dashboard...");
            setTimeout(() => navigate("/dashboard"), 2000);
        } catch (err) {
            console.error("Signup Error:", err.code, err.message);

            let errorMessage = "An unexpected error occurred.";
            switch (err.code) {
                case "auth/email-already-in-use":
                    errorMessage = "This email is already registered.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Invalid email format.";
                    break;
                case "auth/weak-password":
                    errorMessage = "Password should be at least 6 characters.";
                    break;
                case "auth/network-request-failed":
                    errorMessage = "Network error. Check your connection.";
                    break;
                case "auth/operation-not-allowed":
                    errorMessage = "Email/password sign-up is disabled. Enable it in Firebase.";
                    break;
                default:
                    errorMessage = err.message;
            }

            setError(errorMessage);
            dispatch(loginFailure(errorMessage));
        }
        finally {
            setLoading(false);
        }
    }, [email, password, confirmPassword, dispatch, navigate]);

    return (
        <Box maxW="400px" mx="auto" mt="50px" p={5} borderWidth="1px" borderRadius="lg">
            <Heading textAlign="center" mb={5}>
                Sign Up
            </Heading>

            {error && (
                <Alert status="error" mb={3}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}

            {success && (
                <Alert status="success" mb={3}>
                    <AlertIcon />
                    {success}
                </Alert>
            )}

            <form onSubmit={handleSignUp}>
                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="Enter a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Confirm Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </FormControl>

                    <Button type="submit" colorScheme="blue" width="full" isLoading={loading}>
                        Sign Up
                    </Button>

                    <Text fontSize="sm">
                        Already have an account?{" "}
                        <Text as="span" color="blue.500" cursor="pointer" onClick={() => navigate("/login")}>
                            Log in
                        </Text>
                    </Text>
                </VStack>
            </form>
        </Box>
    );
};

export default SignUp;
