import React from 'react';
import { Box, Flex, Text, Tag, VStack, HStack , Avatar} from '@chakra-ui/react';
import { SparkIcon } from './SparkIcon'; 

const PostCard = ({ post }) => {
  const { title, content, tags, author, totalSparks, createdAt } = post;

  const formattedDate = new Date(createdAt || post.dateOfPost).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box borderWidth="2px" borderRadius="lg" p={4} shadow="sm" bg="white" w="full">
      <VStack align="stretch" spacing={4}>
        <Flex justify="space-between" align="center">
          <Text fontSize="sm" color="gray.700">
            {formattedDate}
          </Text>
          <Tag size="sm" colorScheme="blue" borderRadius="full">
            {tags && tags.length > 0 ? tags[0] : 'No Tag'}
          </Tag>
        </Flex>
        <Text fontSize="lg" fontWeight="semibold" noOfLines={2}>
          {title}
        </Text>
        <Flex justify="space-between" align="center">
          <Text fontSize="sm" color="gray.700">
            By {author.email}
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
};

export default PostCard;