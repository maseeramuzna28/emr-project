import { useState } from 'react';

export function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      const url = isRegister
        ? 'http://127.0.0.1:8000/auth/register'
        : 'http://127.0.0.1:8000/auth/login';

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (isRegister) {
        if (res.ok) {
          setError('Account created! Please login.');
          setIsRegister(false);
        } else {
          setError(data.detail || 'Registration failed');
        }
      } else {
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          onLogin();
        } else {
          setError(data.detail || 'Invalid credentials');
        }
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure backend is running.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 w-full max-w-md border border-white/30">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">M</div>
          <div>
            <h2 className="font-bold text-gray-900">MediCare EMR</h2>
            <p className="text-xs text-gray-500">Secure Medical Records System</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
        <p className="text-gray-500 mb-6">{isRegister ? 'Register to access the system' : 'Login to your account'}</p>

        {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl mb-4">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@hospital.com"
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all"
          >
            {isRegister ? 'Register' : 'Login'}
          </button>

          <p className="text-center text-sm text-gray-500">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-purple-600 ml-1 hover:underline">
              {isRegister ? 'Login' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}