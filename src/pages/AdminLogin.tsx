import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, KeyRound } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const AdminLogin: React.FC = () => {
  const { login } = useAdmin();
  const [email, setEmail] = useState('admin@chopflow.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFillDemo = () => {
    setEmail('admin@chopflow.com');
    setPassword('password123');
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const ok = await login(email, password);
      if (!ok) {
        setErrorMsg('Invalid Super Admin credentials. Use admin@chopflow.com and password123.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 flex items-center justify-center shadow-xl shadow-purple-900/40 ring-1 ring-purple-400/30 mb-4 animate-fade-in">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black font-display tracking-tight text-white">
            Chop<span className="text-purple-400">Flow</span>
          </h2>
          <div className="flex items-center space-x-1.5 mt-1">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-950/90 text-purple-400 border border-purple-800/80">
              Platform Super Admin Portal
            </span>
          </div>
          <p className="mt-2 text-center text-xs text-slate-400 max-w-sm">
            Sign in to govern multi-tenant subscriptions, track MRR growth, and manage global restaurant deployments.
          </p>
        </div>

        {/* Demo Fast Fill Pill */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleFillDemo}
            className="group flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-700/50 text-purple-300 hover:text-purple-200 transition-all shadow-sm"
          >
            <KeyRound className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
            <span>Fill Master Super Admin Demo</span>
          </button>
        </div>

        {/* Login Card */}
        <div className="mt-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/80 border border-red-800/80 flex items-start space-x-2.5 text-red-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@chopflow.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Master Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-purple-900/40 transition-all duration-200 active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Authenticate & Access Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice Footer */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-center space-x-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Strict Role-Based Multi-Factor Governance Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};
