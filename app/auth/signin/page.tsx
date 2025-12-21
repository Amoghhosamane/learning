'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    <div className="min-h-screen bg-black flex">
      {/* Left Side - Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-center px-16 w-full">
          <div>
            <h1 className="text-6xl font-bold text-red-600 mb-6">SkillOrbit</h1>
            <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
              Master in-demand skills with <br />
              <span className="text-red-400 font-semibold">expert-led courses</span> and <br />
              <span className="text-white font-semibold">hands-on projects</span>
            </p>
            <div className="space-y-3">
              {[
                "🎯 Interactive live sessions",
                "🚀 Project-based learning", 
                "💼 Career certificates",
                "👥 Join 10,000+ students"
              ].map((feature, index) => (
                <div key={index} className="flex items-center text-gray-300 text-lg">
                  <span className="mr-3 text-green-400">✓</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="bg-black bg-opacity-80 backdrop-blur-lg rounded-3xl border-2 border-gray-800 p-10 shadow-2xl">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-4xl font-bold text-red-600 mb-2">SkillOrbit</h1>
              <p className="text-gray-400">Continue your learning journey</p>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white">
                Welcome Back
              </h2>
              <p className="text-gray-400 mt-2">Sign in to your account</p>
            </div>

            {/* Error Message - NEW */}
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded-2xl mb-6">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-3">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-5 py-4 bg-gray-800 border-2 border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-all duration-300"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-3">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-5 py-4 bg-gray-800 border-2 border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-all duration-300"
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-gray-400">
                  New to SkillOrbit?{' '}
                  <Link href="/auth/signup" className="text-red-500 hover:text-red-400 font-medium transition duration-200">
                    Create an account
                  </Link>
                </p>
              </div>
            </form>

            {/* Updated Demo Info */}
            <div className="mt-6 p-4 bg-gray-800 rounded-2xl border-2 border-gray-700">
              <p className="text-sm text-gray-400 text-center">
                <strong>Note:</strong> Real authentication is now active
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}