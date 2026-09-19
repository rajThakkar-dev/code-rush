import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ResultCard from '../components/ResultCard';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const snippet = location.state?.snippet;
  useEffect(()=>{ if (!result) navigate('/practice', {replace:true}); }, [result,navigate]);
  if (!result) return null;
  const tryAgain = () => navigate('/practice', { state: { retrySnippet: snippet } });
  const newSnippet = () => navigate('/practice');
  return <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16"><div className="mb-6 text-center"><Link to="/practice" className="text-sm text-slate-500 hover:text-cyan-300">← Back to practice</Link></div><ResultCard result={result} onTryAgain={tryAgain} onNewSnippet={newSnippet}/></main>;
}
