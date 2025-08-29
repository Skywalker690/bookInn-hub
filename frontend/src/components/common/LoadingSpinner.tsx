import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | undefined;
  variant?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size,
  variant = 'primary'
}) => {
  return (
    <Container 
      className="d-flex flex-column justify-content-center align-items-center" 
      style={{ minHeight: '200px' }}
    >
      <Spinner 
        animation="border" 
        variant={variant}
        size={size}
        role="status"
        aria-hidden="true"
      />
      <p className="mt-2 text-muted">{message}</p>
    </Container>
  );
};

export default LoadingSpinner;