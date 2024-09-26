import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { SearchContext } from '../../contexts/searchContext';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const { searchTerm, setSearchTerm } = useContext(SearchContext); // Access the context
  const [localSearchTerm, setLocalSearchTerm] = useState(''); // Local state for the input

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(localSearchTerm); // Update the context state
    setLocalSearchTerm(''); // Clear the input field
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md py-4">
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
          {/* Updated Button to Navigate to the Create Post Page */}
          <Link
            to="/create-post"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Share idea
          </Link>

          <div className="relative">
            <img
              src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1726531200&semt=ais_hybrid"
              alt="User Avatar"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
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
