import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getColors = () => {
    switch (type) {
      case 'error':
        return {
          bg: '#2F1E1E',
          border: '1px solid #6E2D2D',
          text: '#F5C2C2',
          icon: <AlertCircle size={18} style={{ color: '#E57373' }} />
        };
      case 'info':
        return {
          bg: '#1F2A38',
          border: '1px solid #2B4E6F',
          text: '#C0D5E8',
          icon: <Info size={18} style={{ color: '#64B5F6' }} />
        };
      case 'success':
      default:
        return {
          bg: '#1F2E22',
          border: '1px solid #2B6E39',
          text: '#C2F5CD',
          icon: <CheckCircle2 size={18} style={{ color: '#81C784' }} />
        };
    }
  };

  const style = getColors();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        background: style.bg,
        border: style.border,
        color: style.text,
        padding: '12px 18px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        maxWidth: '360px'
      }}
      className="custom-toast"
    >
      {style.icon}
      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          color: 'var(--text-muted)',
          display: 'flex',
          marginLeft: 'auto'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
