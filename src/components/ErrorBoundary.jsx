import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: 'Inter, sans-serif',
          padding: '2rem', textAlign: 'center'
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', marginBottom: '1.5rem'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Something went wrong</h1>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 1.5rem', maxWidth: '400px' }}>
            An unexpected error occurred. Please restart the application.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px', borderRadius: '10px', border: 'none',
              background: 'rgba(124,58,237,0.2)', color: '#a78bfa',
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
            }}
          >
            Reload Application
          </button>
          {this.state.error && (
            <details style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#64748b', maxWidth: '500px' }}>
              <summary>Error details</summary>
              <pre style={{ textAlign: 'left', marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

// Commit: feat: add ErrorBoundary component for error handling [132225]
