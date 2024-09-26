import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import Home from './pages/Home';
import PostPage from './pages/PostPage';
import { AuthContextProvider, useAuthContext } from './contexts/AuthContext'; 
import { SearchProvider } from './contexts/searchContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Register';
import ProtectedRoute from './components/shared/ProtectedRoute';
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
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
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
          <SearchProvider>
            <Layout />
          </SearchProvider>
        </AuthContextProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
