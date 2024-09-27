import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthForm.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [about, setAbout] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', { name, email, password, about }, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      setError('Registration failed');
    }
  };

  const redirectToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="SignupPage">
      <div className="SignupBox">
        <h2 className="SignupTxt">Create account!</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={submitHandler}>
          <div className="InputFeild">
            <div className="NameBox">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="NameInput"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="EmailBox">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter email"
                className="EmailInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="PasswordBox">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="PasswordInput0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="AboutBox">
              <label>About</label>
              <textarea
                placeholder="Tell us about yourself"
                className="AboutInput"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="SignupBtn">Create</button>
        </form>
        <button className="SignupBtn" onClick={redirectToLogin}>Already have an account? Login</button>
      </div>
      <div className="SideImg">
        <h1 className="BrandName">ThinkTank</h1>
      </div>
    </div>
  );
};

export default Register;
