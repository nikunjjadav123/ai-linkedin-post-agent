import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyAuthCode } from '../services/api';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    const code = searchParams.get('code');
    const err = searchParams.get('error');

    if (err) {
      setError(`Authentication failed: ${err}`);
      return;
    }

    if (!code) {
      setError('No authorization code found.');
      return;
    }

    verifyAuthCode(code)
      .then((data) => {
        localStorage.setItem('linkedin_token', data.linkedin_token);
        localStorage.setItem('linkedin_person_id', data.linkedin_person_id);
        navigate('/', { replace: true });
      })
      .catch((err) => {
        console.error('Failed to verify code', err);
        setError('Failed to securely exchange LinkedIn authorization code.');
      });
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="text-red-500 font-bold mb-4">{error}</div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-slate-600">Securely linking your professional account...</p>
    </div>
  );
}
