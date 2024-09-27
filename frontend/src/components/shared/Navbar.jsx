import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { SearchContext } from '../../contexts/searchContext';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(localSearchTerm);
    setLocalSearchTerm('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md py-4 fixed w-full z-10" style={{ position: 'sticky', top: 0 }}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/home">
          <div className="text-3xl font-bold text-blue-500">
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
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Search
          </button>
        </form>

        <div className="flex items-center space-x-4">
          <Link
            to="/create-post"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Share idea
          </Link>

          <div className="relative">
            <FaUserCircle
              className="w-10 h-10 text-gray-600 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => setDropdownOpen(false)}
                >
                  My Profile
                </Link>
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
