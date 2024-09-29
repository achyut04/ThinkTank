import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Heading, Text, SimpleGrid, VStack, useColorModeValue, HStack, Avatar, Button, Tab, Tabs, TabList, TabPanels, TabPanel, Spinner } from '@chakra-ui/react';
import PostCard from '../components/Posts/PostCard';
import { getPostsByCreator } from '../services/postService';
import { getCurrentUser } from '../services/authService';
import { getCommentsByUser } from '../services/commentService';

const ProfilePage = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState(0); 
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  useEffect(() => {
    const savedTabIndex = localStorage.getItem('activeTab');
    if (savedTabIndex) {
      setActiveTab(parseInt(savedTabIndex, 10));
    }

    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user && user.isAuthenticated) {
          setCurrentUser(user.user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!currentUser) return;
      try {
        const data = await getPostsByCreator(currentUser.id);
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error('Fetched data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchUserPosts();
  }, [currentUser]);

  useEffect(() => {
    const fetchUserComments = async () => {
      if (!currentUser) return;
      try {
        const data = await getCommentsByUser(currentUser.id);
        if (Array.isArray(data)) {
          setComments(data);
        } else {
          console.error('Fetched data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching user comments:', error);
      }
    };

    fetchUserComments();
  }, [currentUser]);


  const handleTabChange = (index) => {
    setActiveTab(index);
    localStorage.setItem('activeTab', index);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box maxW="900px" mx="auto" mt={10} p={5} borderWidth="1px" borderRadius="lg">
      <HStack spacing={5}>
        <Avatar size="xl" src="../assets/avatar.png" />
        <Box>
          <Heading size="md">{currentUser?.name}</Heading>
          <Button mt={3} size="sm" colorScheme="blue">
            <Link to='/me'>Edit Profile</Link>
          </Button>
        </Box>
      </HStack>

      <Tabs mt={10} variant="enclosed" index={activeTab} onChange={handleTabChange}>
        <TabList>
          <Tab>Ideas</Tab>
          <Tab>Comments</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack spacing={8} align="start" width="100%">
              <Heading as="h2" size="lg">Ideas</Heading>
              {posts.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} width="100%">
                  {posts.map((post) => (
                    <Link to={`/posts/${post._id}`} key={post._id} style={{ textDecoration: 'none' }}>
                      <Box transition="all 0.3s" _hover={{ transform: 'scale(1.05)' }}>
                        <PostCard post={post} />
                      </Box>
                    </Link>
                  ))}
                </SimpleGrid>
              ) : (
                <Text color={textColor} fontSize="lg">
                  No posts available at the moment.
                </Text>
              )}
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={8} align="start" width="100%">
              <Heading as="h2" size="lg">Comments</Heading>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <Box key={comment._id} p={4} borderWidth="1px" borderRadius="lg" width="100%">
                    <Text fontWeight="bold">Comment:</Text>
                    <Text>{comment.content}</Text>
                    <Link to={`/posts/${comment.post._id}`} style={{ color: 'blue' }}>
                      Go to Post: {comment.post.title}
                    </Link>
                  </Box>
                ))
              ) : (
                <Text color={textColor} fontSize="lg">
                  No comments available at the moment.
                </Text>
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ProfilePage;
