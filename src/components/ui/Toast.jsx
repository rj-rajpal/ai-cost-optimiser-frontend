import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const Toast = ({ 
  id,
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose,
  action
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.(id);
    }, 200);
  };

  const handleActionClick = () => {
    action?.onClick?.();
    handleClose();
  };

  const getToastStyles = () => {
    const baseStyles = "flex items-start space-x-3 p-4 rounded-lg shadow-elevation border";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-surface border-success text-text-primary`;
      case 'error':
        return `${baseStyles} bg-surface border-error text-text-primary`;
      case 'warning':
        return `${baseStyles} bg-surface border-warning text-text-primary`;
      default:
        return `${baseStyles} bg-surface border-primary text-text-primary`;
    }
  };

  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'CheckCircle';
      case 'error':
        return 'XCircle';
      case 'warning':
        return 'AlertTriangle';
      default:
        return 'Info';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-primary';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`
      ${getToastStyles()}
      transform transition-all duration-200 ease-smooth
      ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      animate-slide-in
    `}>
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <Icon 
          name={getIconName()} 
          size={20} 
          className={getIconColor()}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-sm font-semibold text-text-primary mb-1">
            {title}
          </h4>
        )}
        {message && (
          <p className="text-sm text-text-secondary">
            {message}
          </p>
        )}
        
        {/* Action Button */}
        {action && (
          <button
            onClick={handleActionClick}
            className="mt-2 text-sm font-medium text-primary hover:text-primary-600 transition-colors duration-200"
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-md text-text-tertiary hover:text-text-secondary hover:bg-surface-700 transition-colors duration-200"
        aria-label="Close notification"
      >
        <Icon name="X" size={16} />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts = [], onRemoveToast }) => {
  return (
    <div className="fixed top-20 right-6 z-notification space-y-3 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemoveToast}
        />
      ))}
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { ...toast, id }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  // Convenience methods
  const showSuccess = (title, message, options = {}) => {
    return addToast({ type: 'success', title, message, ...options });
  };

  const showError = (title, message, options = {}) => {
    return addToast({ type: 'error', title, message, duration: 0, ...options });
  };

  const showWarning = (title, message, options = {}) => {
    return addToast({ type: 'warning', title, message, ...options });
  };

  const showInfo = (title, message, options = {}) => {
    return addToast({ type: 'info', title, message, ...options });
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export { ToastContainer };
export default Toast;