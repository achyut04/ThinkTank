import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { getCurrentUser, updateUserProfile, deleteUserProfile } from '../../services/authService';

const ProfileDetails = () => {
  const [userData, setUserData] = useState({});
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const user = await getCurrentUser();
        if (!user || !user.user.id) {
          throw new Error('User not authenticated');
        }
        setUserData(user.user);
        setName(user.user.name);
        setAbout(user.user.about);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };
    getUserData();
  }, [navigate]);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('about', about);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
  
    try {
      await updateUserProfile(formData); // Pass the FormData object
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUserProfile();
      logout();
      navigate('/signup');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete the account. Please try again.');
    }
  };

  return (
    <div className="container mx-auto my-10 p-5 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-5">My Profile</h2>

      {/* Profile Picture Display */}
      {userData.profilePicture && (
        <div className="mb-4">
          <img
            src={`http://localhost:5000${userData.profilePicture}`} // Update the URL according to your server config
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover" // Adjust the size and styles as needed
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          value={userData.email}
          disabled
          className="w-full px-4 py-2 border rounded-md bg-gray-100"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">About</label>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Profile Picture</label>
        <input
          type="file"
          onChange={(e) => setProfilePicture(e.target.files[0])}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleUpdate}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Update
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfileDetails;
