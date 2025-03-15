import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Component Error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-900/20 text-red-300 rounded-lg my-4">
          <h2 className="text-lg font-bold mb-2">⚠️ Display Error</h2>
          <p>Could not display content. Please try refreshing the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
