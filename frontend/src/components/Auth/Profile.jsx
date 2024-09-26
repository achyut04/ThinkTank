import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [email, setEmail] = useState('');
  const [about, setAbout] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/users/profile', { withCredentials: true });
        setProfile(data);
        setEmail(data.email);
        setAbout(data.about);
      } catch (error) {
        setError('Failed to load profile');
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        '/api/users/profile',
        { email, about },
        { withCredentials: true }
      );
      setError('');
      alert('Profile updated successfully');
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={submitHandler}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
