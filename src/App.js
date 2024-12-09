import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";

import AuthLayout from "./layouts/AuthLayout";
import IntroPage from "./components/intro/IntroPage";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import VerifyCode from "./components/auth/VerifyCode";
import Dashboard from "./components/dashboard/Dashboard";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/common/PrivateRoute";
import NotFound from "./components/common/NotFound";
import { ToastProvider } from "./contexts/ToastContext";

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="verify" element={<VerifyCode />} />
            </Route>
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
