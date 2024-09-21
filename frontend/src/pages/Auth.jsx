import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Auth = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formState, setFormState] = useState({
    email: '',
    password: ''
  });

  const switchModeHandler = () => {
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    const url = isLoginMode
      ? 'http://localhost:5000/api/users/login'
      : 'http://localhost:5000/api/users/register';

    try {
      const response = await sendRequest(url, 'POST', JSON.stringify({
        email: formState.email,
        password: formState.password
      }), {
        'Content-Type': 'application/json'
      });
      auth.login(response.user.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={authSubmitHandler}>
      <input
        type="email"
        placeholder="Email"
        value={formState.email}
        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={formState.password}
        onChange={(e) => setFormState({ ...formState, password: e.target.value })}
      />
      <button type="submit">{isLoginMode ? 'LOGIN' : 'SIGNUP'}</button>
      <button type="button" onClick={switchModeHandler}>
        SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
      </button>
    </form>
  );
};

export default Auth;
