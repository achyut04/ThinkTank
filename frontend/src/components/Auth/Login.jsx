import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext } from '../../contexts/AuthContext';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  InputGroup,
  InputLeftElement,
  Container,
} from '@chakra-ui/react';
import { EmailIcon, LockIcon } from '@chakra-ui/icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const { login } = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password }, { withCredentials: true });

      console.log("Login successful, user ID:", data._id);
      console.log("JWT Cookie after login:", Cookies.get('jwt'));

      login(data._id);

      toast({
        title: "Login Successful",
        description: "You've been successfully logged in.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate('/home');
    } catch (error) {
      console.error("Login failed", error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const redirectToSignUp = () => {
    navigate('/signup');
  };

  return (
    <Container maxW="lg" py={12}>
      <Box bg="white" p={8} rounded="lg" boxShadow="lg">
        <VStack spacing={8} align="stretch">
          <VStack spacing={2} align="center">
            <Heading>Log in to ThinkTank</Heading>
            <Text fontSize="sm" color="gray.600">
              Enter your credentials to access your account
            </Text>
          </VStack>
          <form onSubmit={submitHandler}>
            <VStack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={<EmailIcon color="gray.300" />} />
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={<LockIcon color="gray.300" />} />
                  <Input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full">
                Log in
              </Button>
            </VStack>
          </form>
          <Text fontSize="sm" textAlign="center">
            Don't have an account?{' '}
            <Link color="blue.500" onClick={redirectToSignUp}>
              Sign Up
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;