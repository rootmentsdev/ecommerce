import React from 'react';
import { Container } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <Container className="py-5">
          <div className="text-center">
            <h2 style={{ fontFamily: 'Century Gothic', color: '#dc3545' }}>
              Something went wrong
            </h2>
            <p style={{ fontFamily: 'Century Gothic' }}>
              Please refresh the page or try again later.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
              style={{ fontFamily: 'Century Gothic' }}
            >
              Refresh Page
            </button>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
