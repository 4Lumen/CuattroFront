import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';
import { useAppContext } from '../context/AppContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();

  const handleLogin = React.useCallback(async () => {
    try {
      const user = await AuthService.login();
      dispatch({ type: 'SET_USER', payload: user });
      navigate(user.role === 1 ? '/admin' : '/employee');
    } catch (error) {
      console.error('Login error:', error);
    }
  }, [dispatch, navigate]);

  React.useEffect(() => {
    handleLogin();
  }, [handleLogin]);

  return (
    <div className="login-container">
      <h2>Logging in...</h2>
      <p>Redirecting to Auth0 login page...</p>
    </div>
  );
};

export default LoginPage;
