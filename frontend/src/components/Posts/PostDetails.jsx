import React from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Avatar,
  Button,
  Icon,
  useColorModeValue,
  Link as ChakraLink
} from '@chakra-ui/react';
import { FaStar, FaComment, FaShare } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PostDetails = ({ post, onSpark }) => {
  const { title, content, author, totalSparks, comments, dateOfPost } = post;

  const formattedDate = new Date(dateOfPost).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  const profilePictureUrl = author?.profilePicture 
    ? `http://localhost:5000${author.profilePicture}` 
    : 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1726531200&semt=ais_hybrid';

  return (
    <Box bg={bgColor} rounded="lg" shadow="lg" p={6} transition="all 0.3s">
      <Heading as="h1" size="xl" mb={4} color="blue.600">
        {title}
      </Heading>
      <Flex align="center" mb={6}>
        <ChakraLink as={Link} to={`/profile/${author?._id}`} _hover={{ textDecoration: 'none' }}>
          <Avatar
            src={profilePictureUrl}
            mr={2}
            cursor="pointer"
          />
        </ChakraLink>
        <Box>
          <Text fontWeight="bold">{author?.email || 'Unknown Author'}</Text>
          <Text fontSize="sm" color="gray.500">
            {formattedDate}
          </Text>
        </Box>
      </Flex>
      <Text fontSize="lg" color={textColor} mb={6}>
        {content}
      </Text>
      <Flex justify="space-between" align="center">
        <Flex>
          <Button
            leftIcon={<Icon as={FaStar} />}
            colorScheme="yellow"
            variant="ghost"
            onClick={onSpark}
            mr={4}
          >
            {totalSparks}
          </Button>
          <Button
            leftIcon={<Icon as={FaComment} />}
            variant="ghost"
            mr={4}
          >
            {comments.length} Comments
          </Button>
        </Flex>

      </Flex>
    </Box>
  );
};

export default PostDetails;
