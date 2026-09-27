import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    if (error?.message?.includes('dynamically imported module') || error?.name === 'ChunkLoadError') {
      const hasReloaded = sessionStorage.getItem('chunk_reload');
      if (!hasReloaded) {
        sessionStorage.setItem('chunk_reload', 'true');
        window.location.reload();
        return { hasError: false, error: null };
      }
    }
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("404 Killer App Render Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
          <img src="/app-icon.png" width="64" height="64" alt="404 Killer App" style={{ marginBottom: '20px', borderRadius: '16px', boxShadow: '0 0 25px rgba(16,185,129,0.3)' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>Something went wrong loading 404 Killer App</h1>
          <p style={{ color: '#94a3b8', maxWidth: '450px', marginBottom: '24px', fontSize: '14px' }}>
            We encountered an unexpected error. Please refresh or return to the main dashboard.
          </p>
          <button
            onClick={() => { sessionStorage.removeItem('chunk_reload'); window.location.href = '/'; }}
            style={{ padding: '12px 24px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
          >
            Reload 404 Killer App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const isMobile =
  typeof navigator !== 'undefined' &&
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <MotionConfig reducedMotion={isMobile ? 'always' : 'never'}>
          <App />
        </MotionConfig>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)

setTimeout(() => {
  document.getElementById('static-hero')?.remove();
}, 100);
