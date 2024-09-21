import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Heading, Text, SimpleGrid, VStack, useColorModeValue } from '@chakra-ui/react';
import PostCard from '../components/PostCard';
import Filters from '../components/Filters';
import { getAllPosts } from '../services/postService';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Discover');

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getAllPosts();
      console.log("Fetched posts:", data);
      if (Array.isArray(data)) {
        setPosts(data);
        setFilteredPosts(data);
      } else {
        console.error("Fetched data is not an array:", data);
      }
    };

    fetchPosts();
  }, []);

  const handleFilterChange = (category) => {
    setSelectedFilter(category);
    if (category === 'Discover') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((post) => post.tags.includes(category)));
    }
  };

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={12}>
        <VStack spacing={8} as="section" textAlign="center" mb={12}>
          <Filters selectedFilter={selectedFilter} onFilterChange={handleFilterChange} />
          
          <Heading as="h1" size="2xl" fontWeight="bold">
            Best of ThinkTank
          </Heading>
          <Text color={textColor} fontSize="xl">
            Explore more, share your ideas, and discuss with like-minded people.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={8}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link
                to={`/posts/${post._id}`}
                key={post._id}
                style={{ textDecoration: 'none' }}
              >
                <Box 
                  transition="all 0.3s"
                  _hover={{ transform: 'scale(1.05)' }}
                >
                  <PostCard post={post} />
                </Box>
              </Link>
            ))
          ) : (
            <Text color={textColor} fontSize="lg" gridColumn="1 / -1" textAlign="center">
              No posts available at the moment
            </Text>
          )}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Home;