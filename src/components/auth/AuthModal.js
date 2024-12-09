import React, { useState, useEffect } from 'react';
import { Modal } from 'semantic-ui-react';
import Login from './Login';
import Register from './Register';
import VerifyCode from './VerifyCode';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(() => {
    const verifyData = JSON.parse(localStorage.getItem('verifyData'));
    if (verifyData && !verifyData.isVerified) {
      return 'verify';
    }
    return initialMode;
  });

  const [email, setEmail] = useState(() => {
    const verifyData = JSON.parse(localStorage.getItem('verifyData'));
    return verifyData?.email || '';
  });

  useEffect(() => {
    if (mode === 'verify') {
      localStorage.setItem('verifyData', JSON.stringify({
        email,
        isVerified: false,
        timestamp: Date.now()
      }));
    }
  }, [mode, email]);

  const handleRegisterSuccess = (userEmail) => {
    setEmail(userEmail);
    setMode('verify');
  };

  const handleVerifySuccess = () => {
    localStorage.removeItem('verifyData');
    setMode('login');
    setEmail('');
  };

  const handleClose = () => {
    const verifyData = JSON.parse(localStorage.getItem('verifyData'));
    if (mode !== 'verify' || (verifyData && Date.now() - verifyData.timestamp > 15 * 60 * 1000)) {
      localStorage.removeItem('verifyData');
    }
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      size="tiny"
      className="auth-modal"
    >
      <Modal.Content>
        {mode === 'login' && (
          <Login 
            onSwitchMode={() => setMode('register')}
            onClose={handleClose}
          />
        )}
        {mode === 'register' && (
          <Register 
            onSwitchMode={() => setMode('login')}
            onClose={handleClose}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}
        {mode === 'verify' && (
          <VerifyCode 
            email={email}
            onClose={handleClose}
            onBack={() => setMode('register')}
            onVerifySuccess={handleVerifySuccess}
          />
        )}
      </Modal.Content>
    </Modal>
  );
};

export default AuthModal; 