import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <strong>Error:</strong> {message}
      </div>
    </div>
  );
};

export default ErrorMessage;