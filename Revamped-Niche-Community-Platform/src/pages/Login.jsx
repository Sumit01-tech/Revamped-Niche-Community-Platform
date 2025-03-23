import { useState } from "react";
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
import { loginStart, loginSuccess, loginFailure } from "../redux/slices/authSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        dispatch(loginStart());

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            dispatch(loginSuccess(userCredential.user));
            navigate("/dashboard");
        } catch (err) {
            console.error("Login Error:", err.code, err.message);

            let errorMessage = "Failed to log in. Please check your credentials.";
            switch (err.code) {
                case "auth/user-not-found":
                    errorMessage = "No user found with this email.";
                    break;
                case "auth/wrong-password":
                    errorMessage = "Incorrect password.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Invalid email format.";
                    break;
                case "auth/network-request-failed":
                    errorMessage = "Network error. Please check your connection.";
                    break;
                case "auth/too-many-requests":
                    errorMessage = "Too many failed login attempts. Try again later.";
                    break;
                case "auth/user-disabled":
                    errorMessage = "This account has been disabled.";
                    break;
                default:
                    errorMessage = "An unexpected error occurred. Please try again.";
            }

            setError(errorMessage);
            dispatch(loginFailure(errorMessage));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxW="400px" mx="auto" mt="50px" p={5} borderWidth="1px" borderRadius="lg">
            <Heading textAlign="center" mb={5}>
                Login
            </Heading>

            {error && (
                <Alert status="error" mb={3}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}

            <form onSubmit={handleLogin}>
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
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>

                    <Button type="submit" colorScheme="blue" width="full" isLoading={loading}>
                        Login
                    </Button>

                    <Text fontSize="sm">
                        Don't have an account?{" "}
                        <Text as="span" color="blue.500" cursor="pointer" onClick={() => navigate("/register")}>
                            Sign up
                        </Text>
                    </Text>
                </VStack>
            </form>
        </Box>
    );
};

export default Login;
