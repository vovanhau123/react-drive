import React, { useState } from 'react';
import { Form, Button, Message, Icon } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CustomButton from "../common/CustomButton";
import { BUTTONS } from "../../config/buttons";
import { useToast } from '../../contexts/ToastContext';

const Login = ({ onSwitchMode, onClose }) => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
    setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!formData.email || !formData.password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      await authLogin(formData.email, formData.password);
      showToast('Login successful!', 'success');
      onClose();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <Icon name="close" className="close-button" onClick={onClose} />
      <h2>Sign In</h2>
      <Form onSubmit={handleSubmit} error={!!error}>
        <Form.Input
          fluid
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          error={!!error}
        />
        <Form.Input
          fluid
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={!!error}
        />
        {error && <Message error content={error} />}
        <CustomButton
          {...BUTTONS.AUTH.LOGIN}
          loading={loading}
          disabled={loading}
        />
      </Form>
      <Message>
        Don't have an account?{' '}
        <a href="#" onClick={(e) => {
          e.preventDefault();
          onSwitchMode();
        }}>
          Sign up now
        </a>
      </Message>
    </div>
  );
};

export default Login; 