import React, { useState } from 'react';
import CreatePostModal from './CreatePostModal';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useAuthContext();  
  const navigate = useNavigate(); 

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  
  const handleLogout = () => {
    logout();  
    navigate('/login');  
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to='/Home'>
          <div className="text-2xl font-bold">
            <span>Think</span><span className="text-blue-500">Tank</span>!
          </div>
        </Link>

        <div className="flex items-center space-x-4">

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-full"
            onClick={openModal}
          >
            Share idea
          </button>

 
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

      {isModalOpen && <CreatePostModal closeModal={closeModal} />}
    </header>
  );
};

export default Navbar;
