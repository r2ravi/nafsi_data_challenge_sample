import { Loader } from 'lucide-react';

interface LoadingIndicatorProps {
  message?: string;
}

export default function LoadingIndicator({ message = 'Finding your best matches...' }: LoadingIndicatorProps) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }} role="status" aria-live="polite">
      <Loader size={48} style={{ animation: 'spin 1s linear infinite', color: '#40916c' }} aria-hidden="true" />
      <p style={{ marginTop: '1rem', fontSize: '1.1rem', color: '#555' }}>{message}</p>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
