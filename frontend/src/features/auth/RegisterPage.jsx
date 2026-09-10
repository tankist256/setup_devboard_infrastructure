import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <svg width="48" height="48" viewBox="0 0 100 100" className="mb-4">
            <rect width="100" height="100" rx="20" fill="#6366f1"/>
            <text x="50" y="65" fontFamily="Arial,sans-serif" fontSize="50" fontWeight="bold" fill="white" textAnchor="middle">D</text>
          </svg>
          <h1 className="text-2xl font-bold text-slate-900">Create an Account</h1>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Registering...' : 'Register'}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-brand hover:text-brand-dark font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}
