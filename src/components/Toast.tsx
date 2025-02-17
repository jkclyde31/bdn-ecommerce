import React, { useEffect, useState } from 'react';
import { useWixClient } from "../../hooks/useWixClient";

interface ToastProps {
    message: string;
    onClose: () => void;
  }
  
  interface UserData {
    member?: {
      profile?: {
        nickname?: string;
        photo?: {
          url: string;
        };
      };
    };
  }
  
  export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
  
      return () => clearTimeout(timer);
    }, [onClose]);
  
    return (
      <div className="fixed top-4 right-4 bg-lama text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out animate-slideIn">
        <div className="flex items-center gap-2">
          <span role="img" aria-label="wave">👋</span>
          <p>{message}</p>
        </div>
      </div>
    );
  };