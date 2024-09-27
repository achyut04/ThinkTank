import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext({
  userId: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthContextProvider = (props) => {
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = useCallback((uid) => {
    setUserId(uid);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await axios.post('http://localhost:5000/api/users/logout', {}, { withCredentials: true });
    setUserId(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/users/check-auth', { withCredentials: true });
        if (data.isAuthenticated) {
          setUserId(data.userId);
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);  
      } finally {
        setLoading(false); 
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ userId, login, logout, isAuthenticated, loading }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
