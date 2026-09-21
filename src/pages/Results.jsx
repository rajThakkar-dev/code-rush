import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ResultCard from '../components/ResultCard';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const snippet = location.state?.snippet;

  useEffect(() => { if (!result) navigate('/practice', { replace: true }); }, [result, navigate]);
  if (!result) return null;

  const tryAgain = () => navigate('/practice', { state: { retrySnippet: snippet } });
  const newSnippet = () => navigate('/practice');

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="mb-6 text-center">
        <Link
          to="/practice"
          className="text-sm transition hover:opacity-80"
          style={{ color: 'var(--text-muted)' }}
        >
          Back to practice
        </Link>
      </div>
      <ResultCard result={result} onTryAgain={tryAgain} onNewSnippet={newSnippet} />
    </main>
  );
}
