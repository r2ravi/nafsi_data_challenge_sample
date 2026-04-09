import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '2rem',
        background: '#fff3f3',
        borderRadius: '12px',
        border: '1px solid #ffcdd2',
      }}
      role="alert"
    >
      <AlertTriangle size={48} style={{ color: '#d32f2f' }} aria-hidden="true" />
      <p style={{ margin: '1rem 0 0.5rem', fontSize: '1.05rem', color: '#333' }}>{message}</p>
      <button
        onClick={onRetry}
        style={{
          padding: '0.6rem 1.5rem',
          background: '#2d6a4f',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer',
          marginTop: '0.5rem',
        }}
      >
        🔄 Try Again
      </button>
    </div>
  );
}
