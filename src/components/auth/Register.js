import React, { useState } from "react";
import { Form, Button, Message, Icon } from "semantic-ui-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import "./Register.css";

const Register = ({ onSwitchMode, onClose, onRegisterSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const { showToast } = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validate input
    if (!email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setLoading(true);
      await register(email, password);
      showToast(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực.",
        "success"
      );
      if (onRegisterSuccess) {
        onRegisterSuccess(email);
      }
    } catch (error) {
      const errorMessage = error.message || "Đăng ký thất bại";
      // setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <Icon name="close" className="close-button" onClick={onClose} />
      <h2>Register</h2>
      <Form onSubmit={handleRegister} error={!!error}>
        <Form.Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <Form.Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <Form.Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
        />
        {error && <Message error content={error} />}
        <Button primary type="submit" loading={loading}>
          Register
        </Button>
      </Form>
      <Message>
        Already have an account?{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSwitchMode();
          }}
        >
          Sign in now
        </a>
      </Message>
    </div>
  );
};

export default Register;
