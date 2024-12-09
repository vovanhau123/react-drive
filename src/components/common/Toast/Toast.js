import React, { useEffect, useState } from 'react';
import { Icon } from 'semantic-ui-react';
import './Toast.css';

const Toast = ({ 
  message, 
  type = 'success', // success, error, warning, info
  duration = 3000,
  onClose 
}) => {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(progressInterval);
          return 0;
        }
        return prev - (100 / (duration / 10));
      });
    }, 10);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(), 300); // Đợi animation kết thúc
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  const icons = {
    success: 'check circle',
    error: 'times circle',
    warning: 'exclamation circle',
    info: 'info circle'
  };

  return (
    <div className={`toast-container ${type} ${isVisible ? 'show' : 'hide'}`}>
      <div className="toast-content">
        <Icon name={icons[type]} />
        <span className="toast-message">{message}</span>
        <Icon 
          name="close" 
          className="close-icon" 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }} 
        />
      </div>
      <div className="progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
};

export default Toast; 