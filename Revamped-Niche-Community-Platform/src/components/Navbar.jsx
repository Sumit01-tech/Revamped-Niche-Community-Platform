import { Box, Flex, Button, Spacer, Image } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";

const Navbar = () => {
    const { user, login, logout } = useAuth();

    return (
        <Flex
            as="nav"
            position="fixed"
            top="0"
            left="0"
            right="0"
            bg="blue.500"
            p={4}
            color="white"
            align="center"
            zIndex="10"
            height="60px"
        >
            <Image src={logo} boxSize="50px" alt="Logo" />
            <Box ml={4} fontSize="xl">Niche Community</Box>
            <Spacer />
            {user ? (
                <>
                    <Button onClick={logout} colorScheme="red" ml={4}>Logout</Button>
                </>
            ) : (
                <Button onClick={login} colorScheme="green">Login</Button>
            )}
        </Flex>
    );
};

export default Navbar;
