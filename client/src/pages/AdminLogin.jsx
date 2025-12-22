import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, setAuthError, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      const { data } = await authAPI.login({ email, password, role: 'admin' });
      login(data.token, data.user);
      navigate('/admin');
    } catch (err) {
      setAuthError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl shadow-lg p-8">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full"
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="btn-primary px-8 py-2 rounded-lg font-semibold disabled:opacity-50 transition-all"
              style={{ minWidth: '180px' }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
