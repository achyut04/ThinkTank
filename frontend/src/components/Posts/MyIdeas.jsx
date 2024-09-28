// MyIdeas.jsx
import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Badge, Heading, Text, Avatar } from '@chakra-ui/react';
import { getPostsByCreator } from '../../services/postService';

const MyIdeas = ({ userId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId){ 
        console.log("User id not found");
        return
      };
      try {
        const response = await getPostsByCreator(userId);
        console.log('User ID:', userId);
        console.log('Fetched posts:', response);
        setPosts(response);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [userId]);

  return (
    <VStack spacing={5}>
      {posts.length > 0 ? (
        posts.map(post => (
          <Box key={post._id} p={5} borderWidth="1px" borderRadius="lg" width="100%">
            <HStack justifyContent="space-between">
              <Text fontSize="sm">{new Date(post.createdAt).toLocaleDateString()}</Text>
              <Badge colorScheme="blue">{post.category}</Badge>
            </HStack>
            <Heading size="sm" mt={3}>{post.title}</Heading>
            <Text mt={2}>{post.content}</Text>
            <HStack mt={3}>
              <Avatar size="xs" src="../assets/avatar.png" />
              <Text fontSize="sm">{post.authorName}</Text>
            </HStack>
          </Box>
        ))
      ) : (
        <Text>No ideas to show.</Text>
      )}
    </VStack>
  );
};

export default MyIdeas;
