import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Trigger exit animation
      setTimeout(onClose, 300); // Wait for animation to finish before calling onClose
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 bg-lama text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out ${
        isVisible ? 'animate-slideIn' : 'animate-slideOut'
      }`}
    >
      <div className="flex items-center gap-2">
        <span role="img" aria-label="wave">👋</span>
        <p>{message}</p>
      </div>
    </div>
  );
};