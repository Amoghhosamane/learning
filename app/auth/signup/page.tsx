'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

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
      setError("Passwords don't match!");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Call your register API to SAVE user in MongoDB
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
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // 2️⃣ Auto-login after successful registration
      const loginResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (loginResult?.ok) {
        window.location.href = '/dashboard'; // or /education-dashboard
      } else {
        // Fallback if auto-login fails but registration succeeded
        window.location.href = '/auth/signin?registered=true';
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError('An error occurred. Please try again.');
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex">
      {/* Left Side - Branding & Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-purple-600/20"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-500 rounded-full blur-xl opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500 rounded-full blur-xl opacity-20"></div>

        <div className="relative z-10 flex flex-col justify-center px-16 w-full">
          <div>
            <h1 className="text-7xl font-bold text-white mb-6">SkillOrbit</h1>
            <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
              Start your learning journey <br />
              <span className="text-red-400 font-semibold">Join thousands of students</span> and <br />
              <span className="text-purple-400 font-semibold">transform your career</span>
            </p>

            <div className="space-y-4">
              {[
                "Expert-led courses",
                " Hands-on projects",
                " Career certificates",
                " Community support",
                " Learn at your pace"
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center text-gray-300 text-lg"
                >
                  <span className="mr-3">✨</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="bg-black bg-opacity-60 backdrop-blur-xl rounded-3xl border-2 border-gray-800 p-10 shadow-2xl">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-4xl font-bold text-red-600">SkillOrbit</h1>
              <p className="text-gray-400 mt-2">Create your account</p>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2 text-center">
              Join LearnHub
            </h2>
            <p className="text-gray-400 text-center mb-8">
              Create your free account
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-2xl text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-3">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-800 border-2 border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-all duration-300"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-3">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-800 border-2 border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-3">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-800 border-2 border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-all duration-300"
                  placeholder="Create a password"
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-3">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-800 border-2 border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-all duration-300"
                  placeholder="Confirm your password"
                />
              </div>

              {/* Sign Up Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-2xl font-semibold text-lg relative overflow-hidden group shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading && (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3 animate-spin"></div>
                    )}
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </span>

                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-800 transform -translate-x-full group-hover:translate-x-full"></div>
                </button>
              </div>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-red-500 hover:text-red-400 font-medium transition duration-200 hover:scale-105 inline-block">
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded-2xl border-2 border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              © 2024 SkillOrbit. Start learning today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
