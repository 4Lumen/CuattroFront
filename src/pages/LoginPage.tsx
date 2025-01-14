import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import AuthService from '../services/authService';
import { CircularProgress, Alert } from '@mui/material';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    const handleAuth = async () => {
      try {
        setError(null);

        // Se não há parâmetros de autenticação na URL, inicia o login
        if (!window.location.search.includes('code=') && 
            !window.location.search.includes('state=')) {
          await AuthService.login();
          return;
        }

        // Processa o callback do Auth0
        const user = await AuthService.handleRedirectCallback();
        
        // Se o componente foi desmontado, não continua
        if (!isSubscribed) return;

        if (user) {
          dispatch({ type: 'SET_USER', payload: user });
          navigate('/', { replace: true });
        } else {
          setError('Falha na autenticação. Por favor, tente novamente.');
        }
      } catch (error) {
        console.error('Login error:', error);
        if (isSubscribed) {
          setError('Ocorreu um erro durante o login. Por favor, tente novamente.');
        }
      } finally {
        if (isSubscribed) {
          setIsProcessing(false);
        }
      }
    };

    handleAuth();

    // Cleanup function
    return () => {
      isSubscribed = false;
    };
  }, [dispatch, navigate]);

  if (!isProcessing && error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <img src="/logo.png" alt="Cuattro" className="h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Erro no Login</h1>
          </div>

          <Alert severity="error" className="mt-4">
            {error}
          </Alert>

          <button
            onClick={() => AuthService.login()}
            className="w-full mt-4 px-4 py-2 text-white bg-primary-600 rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <img src="/logo.png" alt="Cuattro" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo ao Cuattro</h1>
          <p className="text-gray-600">Aguarde enquanto processamos seu login...</p>
        </div>

        <div className="flex justify-center mt-4">
          <CircularProgress />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
