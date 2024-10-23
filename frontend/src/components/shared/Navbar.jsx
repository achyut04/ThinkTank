import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { SearchContext } from '../../contexts/searchContext';
import { FaUserCircle } from 'react-icons/fa';
import { getCurrentUser } from '../../services/authService';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [userId, setUserId] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(localSearchTerm);
    setLocalSearchTerm('');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user && user.isAuthenticated) {
          setProfilePicture(user.user.profilePicture); 
          setUserId(user.user.id);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md py-4 fixed w-full z-10" style={{ position: 'sticky', top: 0 }}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/home">
          <div className="text-3xl font-bold text-black-500">
            <span>Think</span>
            <span className="text-blue-500">Tank</span>!
          </div>
        </Link>

        <form className="flex items-center space-x-4" onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ideas"
            className="px-4 py-2 border rounded-lg"
          />
        </form>

        <div className="flex items-center space-x-4">
          <Link
            to="/create-post"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Share idea
          </Link>

          <div className="relative">
          {profilePicture ? (
          <img
            src={`http://localhost:5000${profilePicture}`}
            className="w-10 h-10 rounded-full cursor-pointer" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            alt="Profile"
          />
                ) : (

                
                  <FaUserCircle
                    className="w-10 h-10 text-gray-600 cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  />
                )}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                {userId && ( 
                  <Link
                    to={`/profile/${userId}`}  
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                )}
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
