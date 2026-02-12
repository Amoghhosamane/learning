'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, ChevronRight, Zap, Star, Users } from 'lucide-react';

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        return;
      }

      if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex selection:bg-red-500/30">
      {/* Left Side - Cinematic Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black border-r border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 z-10" />
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-40 scale-110 grayscale"
            alt="Cyber Background"
          />
        </div>

        <div className="relative z-20 flex flex-col justify-center px-24 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-black tracking-[0.4em] text-red-600 uppercase mb-4 block">Welcome Back</span>
            <h1 className="text-6xl font-black italic tracking-tighter text-white mb-8 leading-none">
              ACCESS THE <br />
              <span className="text-red-600 underline decoration-red-600/20 underline-offset-8">INFINITY</span>
            </h1>

            <div className="space-y-6 max-w-md">
              {[
                { icon: <Zap size={16} />, text: "Real-time industry insights", color: "text-yellow-500" },
                { icon: <Star size={16} />, text: "Certified expert instructors", color: "text-red-500" },
                { icon: <Users size={16} />, text: "Community of 10k+ developers", color: "text-blue-500" }
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

        {/* Decorative elements */}
        <div className="absolute bottom-12 left-24 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="text-[9px] font-black text-gray-500 tracking-[0.3em] uppercase italic">System Operational</span>
        </div>
      </div>

      {/* Right Side - Portal Form */}
      <div className="flex-1 flex items-center justify-center px-8 lg:px-24 py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-900/5 blur-[100px] rounded-full" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] border border-white/10 p-12 shadow-2xl">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-red-600/10 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-red-600/20">
                <Shield size={24} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white mb-2 uppercase">SIGN IN</h2>
              <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase italic">Enter your details to continue</p>
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

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="group relative">
                  <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-3 block italic ml-1">Email Address</label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 pl-14 text-sm font-medium focus:outline-none focus:border-red-600/50 focus:bg-white/[0.07] transition-all"
                      placeholder="Enter your email"
                    />
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-600 transition-colors" size={18} />
                  </div>
                </div>

                <div className="group relative">
                  <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-3 block italic ml-1">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type="password"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 pl-14 text-sm font-medium focus:outline-none focus:border-red-600/50 focus:bg-white/[0.07] transition-all"
                      placeholder="Enter your password"
                    />
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-600 transition-colors" size={18} />
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
                    <>SIGN IN <ChevronRight size={14} /></>
                  )}
                </span>
              </button>

              <div className="text-center pt-8 border-t border-white/5">
                <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase">
                  New here?{' '}
                  <Link href="/auth/signup" className="text-red-500 hover:text-red-400 font-black transition-colors">
                    CREATE ACCOUNT
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <p className="mt-8 text-[9px] font-black text-gray-700 tracking-widest text-center uppercase">
            SKILLORBIT SECURE LOGIN // ENCRYPTED
          </p>
        </motion.div>
      </div>
    </div>
  );
}
