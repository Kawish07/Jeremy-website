import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await auth.login({ email, password });
    if (res.ok) {
      navigate('/admin');
    } else {
      setError(res.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1f2e] via-[#132a3c] to-[#1c3b57] px-4 py-10">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 rounded-3xl bg-[#d8a24a] opacity-20 blur-2xl" aria-hidden="true" />
        <div className="relative rounded-3xl bg-[#f7f1e5] shadow-[0_18px_45px_rgba(15,31,46,0.35)] border border-[#d8a24a]/30 p-8 md:p-10">
          <div className="mb-6">
            <p className="text-xs tracking-[0.35em] text-[#d8a24a] mb-2 uppercase">Secure Access</p>
            <h2 className="text-3xl font-serif text-[#0f1f2e]">Admin Login</h2>
            <div className="w-14 h-1 bg-[#d8a24a] mt-3" />
          </div>

          {error && (
            <div className="mb-4 text-sm text-[#b23b3b] bg-[#fbeaea] border border-[#f0c2c2] rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wide text-[#2f3d4c]">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#d8a24a]/40 text-[#0f1f2e] placeholder-[#9c8a6b] focus:outline-none focus:border-[#d8a24a] focus:ring-2 focus:ring-[#d8a24a]/25 transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wide text-[#2f3d4c]">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#d8a24a]/40 text-[#0f1f2e] placeholder-[#9c8a6b] focus:outline-none focus:border-[#d8a24a] focus:ring-2 focus:ring-[#d8a24a]/25 transition"
              />
            </div>
            <button
              className="w-full py-3 rounded-full font-semibold bg-[#d8a24a] text-[#0f1f2e] border-2 border-[#d8a24a] hover:bg-[#f5c15c] transition-all duration-200 shadow-[0_12px_30px_rgba(216,162,74,0.3)]"
              type="submit"
            >
              Login
            </button>
          </form>

          {/* Signup removed - admins can be created from the Admins manager */}
        </div>
      </div>
    </div>
  );
}
