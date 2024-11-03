import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary a capturé une erreur :", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Error Server.</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
