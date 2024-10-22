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
    <Box borderWidth="1px" borderRadius="lg" p={4} shadow="sm" bg="white" w="full">
      <VStack align="stretch" spacing={4}>
        <Flex justify="space-between" align="center">
          <Text fontSize="sm" color="gray.500">
            {formattedDate}
          </Text>
          <Tag size="sm" colorScheme="blue" borderRadius="full">
            {tags && tags.length > 0 ? tags[0] : 'No Tag'}
          </Tag>
        </Flex>
        <Text fontSize="lg" fontWeight="semibold" noOfLines={2}>
          {title}
        </Text>
        <Text fontSize="sm" color="gray.700" noOfLines={3}>
          {content}
        </Text>
        <Flex justify="space-between" align="center">
          
          <Text fontSize="sm" color="gray.500">
            By {author.email}
          </Text>
          <HStack spacing={1}>
            <SparkIcon className="text-yellow-400" boxSize={4} />
            <Text fontSize="sm">{totalSparks}</Text>
          </HStack>
        </Flex>
      </VStack>
    </Box>
  );
};

export default PostCard;