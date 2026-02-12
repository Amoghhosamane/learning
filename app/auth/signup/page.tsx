'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Shield, ChevronRight, Zap, Star, Trophy } from 'lucide-react';

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Account creation failed');
        setLoading(false);
        return;
      }

      const loginResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (loginResult?.ok) {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/auth/signin?registered=true';
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError('An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex selection:bg-red-500/30">
      {/* Left Side - Cinematic Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black border-r border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 z-10" />
          <img
            src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-40 scale-110 grayscale"
            alt="Cyber Code"
          />
        </div>

        <div className="relative z-20 flex flex-col justify-center px-24 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-black tracking-[0.4em] text-red-600 uppercase mb-4 block">New User</span>
            <h1 className="text-6xl font-black italic tracking-tighter text-white mb-8 leading-none">
              GET <br />
              <span className="text-red-600 underline decoration-red-600/20 underline-offset-8">STARTED</span>
            </h1>

            <div className="space-y-6 max-w-md">
              {[
                { icon: <Zap size={16} />, text: "Modern learning paths", color: "text-red-500" },
                { icon: <Trophy size={16} />, text: "Global certification system", color: "text-yellow-500" },
                { icon: <Star size={16} />, text: "Premium career tracking", color: "text-blue-500" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="flex items-center gap-4 text-gray-400 font-medium italic"
                >
                  <div className={`${item.color} opacity-80`}>{item.icon}</div>
                  <span className="text-sm uppercase tracking-widest font-black text-[10px]">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-24 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="text-[9px] font-black text-gray-500 tracking-[0.3em] uppercase italic">System Operational</span>
        </div>
      </div>

      {/* Right Side - Registration Portal */}
      <div className="flex-1 flex items-center justify-center px-8 lg:px-24 py-12 relative overflow-hidden overflow-y-auto">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-900/5 blur-[100px] rounded-full" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10 py-12"
        >
          <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[3.5rem] border border-white/10 p-12 shadow-2xl">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-red-600/10 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-red-600/20">
                <Shield size={24} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white mb-2 uppercase italic leading-none">CREATE ACCOUNT</h2>
              <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase italic">Create Your SkillOrbit Account</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl mb-8 text-center italic"
              >
                {error}
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="group relative">
                  <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2 block italic ml-1">Full Name</label>
                  <div className="relative">
                    <input
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pl-14 text-sm font-medium focus:outline-none focus:border-red-600/50 focus:bg-white/[0.07] transition-all"
                      placeholder="Enter your name"
                    />
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-600 transition-colors" size={16} />
                  </div>
                </div>

                <div className="group relative">
                  <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2 block italic ml-1">Email Address</label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pl-14 text-sm font-medium focus:outline-none focus:border-red-600/50 focus:bg-white/[0.07] transition-all"
                      placeholder="Enter your email"
                    />
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-600 transition-colors" size={16} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group relative">
                    <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2 block italic ml-1">Password</label>
                    <div className="relative">
                      <input
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pl-14 text-sm font-medium focus:outline-none focus:border-red-600/50 focus:bg-white/[0.07] transition-all"
                        placeholder="Create"
                      />
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-600 transition-colors" size={16} />
                    </div>
                  </div>
                  <div className="group relative">
                    <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2 block italic ml-1">Confirm Password</label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pl-14 text-sm font-medium focus:outline-none focus:border-red-600/50 focus:bg-white/[0.07] transition-all"
                        placeholder="Confirm"
                      />
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-600 transition-colors" size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] relative group overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-black/50"
              >
                <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 group-hover:text-white transition-colors flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>CREATE ACCOUNT <ChevronRight size={14} /></>
                  )}
                </span>
              </button>

              <div className="text-center pt-8 border-t border-white/5">
                <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-red-500 hover:text-red-400 font-black transition-colors">
                    SIGN IN
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <p className="mt-8 text-[9px] font-black text-gray-700 tracking-widest text-center uppercase">
            PROTECTED BY SKILLORBIT SECURITY // V2.4
          </p>
        </motion.div>
      </div>
    </div>
  );
}
