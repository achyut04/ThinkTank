import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Textarea,
  Link,
  Container,
  useToast,
} from '@chakra-ui/react';

const theme = extendTheme({
});

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [about, setAbout] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', { name, email, password, about }, { withCredentials: true });
      toast({
        title: "Registration Successful",
        description: "You've successfully created an account.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please check your information and try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const redirectToLogin = () => {
    navigate('/login');
  };

  return (
    <ChakraProvider theme={theme}>
      <Container maxW="lg" py={12}>
        <Box bg="white" p={8} rounded="lg" boxShadow="lg">
          <VStack spacing={8} align="stretch">
            <VStack spacing={2} align="center">
              <Heading>Create your ThinkTank account</Heading>
              <Text fontSize="sm" color="gray.600">
                Please fill in the details to create your account
              </Text>
            </VStack>
            <form onSubmit={submitHandler}>
              <VStack spacing={4}>
                <FormControl id="name" isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
                <FormControl id="email" isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <FormControl id="about" isRequired>
                  <FormLabel>About</FormLabel>
                  <Textarea
                    placeholder="Tell us about yourself"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </FormControl>
                <Button type="submit" colorScheme="blue" width="full">
                  Create Account
                </Button>
              </VStack>
            </form>
            <Text fontSize="sm" textAlign="center">
              Already have an account?{' '}
              <Link color="blue.500" onClick={redirectToLogin}>
                Log in
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </ChakraProvider>
  );
};

export default Register;
