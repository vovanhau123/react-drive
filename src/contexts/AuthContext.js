import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useToast } from "./ToastContext";
import API_CONFIG from '../config/api.config';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(() => {
    const saved = localStorage.getItem("verifyingEmail");
    return saved ? JSON.parse(saved) : null;
  });
  const { showToast } = useToast();

  const resendVerificationCode = async (email) => {
    try {
      setLoading(true);
      const response = await axios.post(
        API_CONFIG.getFullURL(API_CONFIG.AUTH.RESEND_CODE),
        {
          email,
        }
      );
      showToast("Mã xác thực mới đã được gửi đến email của bạn", "success");
      return response.data;
    } catch (error) {
      console.error("Resend code error:", error.response?.data);
      throw (
        error.response?.data || { message: "Không thể gửi lại mã xác thực" }
      );
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(
        API_CONFIG.getFullURL(API_CONFIG.AUTH.REGISTER),
        {
          email,
          password,
        }
      );

      const verifyData = { email, timestamp: Date.now() };
      setVerifyingEmail(verifyData);
      localStorage.setItem("verifyingEmail", JSON.stringify(verifyData));

      return response.data;
    } catch (error) {
      console.error("Register error:", error.response?.data);

      throw error.response?.data || { message: "Đăng ký thất bại" };
    } finally {
      setLoading(false);
    }
  };

  const verify = async (email, code) => {
    try {
      const response = await axios.post(
        API_CONFIG.getFullURL(API_CONFIG.AUTH.VERIFY),
        {
          email,
          code,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Verify error:", error.response?.data);
      throw error.response?.data || { message: "Verification failed" };
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);

      // Validate input
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const response = await axios.post(
        API_CONFIG.getFullURL(API_CONFIG.AUTH.LOGIN),
        {
          email,
          password,
        }
      );

      const { token, user: userData } = response.data;
      localStorage.setItem("token", token);
      setUser(userData);
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw (
        error.response?.data || { message: error.message || "Login failed" }
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    register,
    verify,
    login,
    logout,
    resendVerificationCode,
    verifyingEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
