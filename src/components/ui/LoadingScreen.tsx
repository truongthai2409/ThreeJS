import React from 'react';
import type { LoadingState } from '../../types';

interface LoadingScreenProps {
  loadingState: LoadingState;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ loadingState }) => {
  if (!loadingState.isLoading) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      color: 'white'
    }}>
      {/* Logo/Title */}
      <div style={{
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          margin: 0,
          marginBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🚀 3D Model Viewer
        </h1>
        <p style={{
          fontSize: '1.2rem',
          margin: 0,
          opacity: 0.9
        }}>
          Interactive Model Experience
        </p>
      </div>

      {/* Loading Animation */}
      <div style={{
        position: 'relative',
        width: '120px',
        height: '120px',
        marginBottom: '30px'
      }}>
        {/* Spinning Ring */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: '4px solid rgba(255, 255, 255, 0.2)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        
        {/* Progress Text */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          {Math.round(loadingState.progress)}%
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '300px',
        height: '8px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        <div style={{
          width: `${loadingState.progress}%`,
          height: '100%',
          background: 'linear-gradient(45deg, #ffffff 0%, #f0f0f0 100%)',
          borderRadius: '4px',
          transition: 'width 0.3s ease',
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
        }} />
      </div>

      {/* Status Text */}
      <p style={{
        fontSize: '1rem',
        margin: 0,
        opacity: 0.8,
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        {loadingState.status}
      </p>

      {/* Loading Tips */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        textAlign: 'center',
        opacity: 0.7
      }}>
        <p style={{
          fontSize: '0.9rem',
          margin: '5px 0'
        }}>
          💡 Tip: Bạn có thể scroll để xoay model khi đã tải xong
        </p>
        <p style={{
          fontSize: '0.9rem',
          margin: '5px 0'
        }}>
          🎨 Sử dụng Color Picker để thay đổi màu sắc từng bộ phận
        </p>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
