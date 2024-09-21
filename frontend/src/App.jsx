import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostPage from './pages/PostPage';
import { AuthContextProvider, useAuthContext } from './contexts/AuthContext'; 
import Login from './components/Login';
import Signup from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { ChakraProvider } from '@chakra-ui/react'

function Layout() {
  const location = useLocation();
  const { isAuthenticated } = useAuthContext();

  const noNavbarPaths = ['/login', '/signup'];

  return (
    <>
 
      {isAuthenticated && !noNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts/:id"
          element={
            <ProtectedRoute>
              <PostPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ChakraProvider>
      <Router>
        <AuthContextProvider>
          <Layout />
        </AuthContextProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
