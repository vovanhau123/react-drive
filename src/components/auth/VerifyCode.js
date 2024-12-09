import React, { useState, useEffect } from "react";
import { Form, Button, Message, Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { BUTTONS } from "../../config/buttons";

const VerifyCode = ({ email, onClose, onBack, onVerifySuccess }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [countdown, setCountdown] = useState(() => {
    const verifyData = JSON.parse(localStorage.getItem("verifyData"));
    if (verifyData?.lastResend) {
      const timeElapsed = (Date.now() - verifyData.lastResend) / 1000;
      if (timeElapsed < 60) {
        return Math.ceil(60 - timeElapsed);
      }
    }
    return 0;
  });

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((current) => {
          if (current <= 1) {
            const verifyData = JSON.parse(localStorage.getItem("verifyData"));
            if (verifyData) {
              localStorage.setItem(
                "verifyData",
                JSON.stringify({
                  ...verifyData,
                  lastResend: null,
                })
              );
            }
            return 0;
          }
          return current - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setResendLoading(true);
    try {
      const response = await fetch(
        "https://5c7b-42-117-143-208.ngrok-free.app/api/auth/resend-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend code");
      }

      const verifyData = JSON.parse(localStorage.getItem("verifyData"));
      if (verifyData) {
        localStorage.setItem(
          "verifyData",
          JSON.stringify({
            ...verifyData,
            lastResend: Date.now(),
          })
        );
      }

      showToast("Verification code has been resent to your email", "success");
      setCountdown(60);
    } catch (err) {
      showToast("Failed to resend verification code", "error");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://5c7b-42-117-143-208.ngrok-free.app/api/auth/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            code: verificationCode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      localStorage.removeItem("verifyData");
      showToast("Email verified successfully! Please login.", "success");
      onVerifySuccess();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <Icon name="close" className="close-button" onClick={onClose} />
      <h2>Email Verification</h2>
      <p className="verification-text">
        Please enter the verification code sent to <strong>{email}</strong>
      </p>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          fluid
          label="Verification Code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter verification code"
        />
        <div className="button-group">
          <Button type="button" onClick={onBack}>
            Back
          </Button>
          <Button primary loading={loading} type="submit">
            {BUTTONS.AUTH.VERIFY.text}
          </Button>
        </div>
      </Form>
      <div className="resend-section">
        <Button
          type="button"
          basic
          disabled={countdown > 0 || resendLoading}
          loading={resendLoading}
          onClick={handleResendCode}
          className="resend-button"
        >
          {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
        </Button>
      </div>
    </div>
  );
};

export default VerifyCode;
