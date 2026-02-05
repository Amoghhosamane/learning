"use client";

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Shield, Users, BookOpen, Activity, AlertTriangle } from 'lucide-react';

export default function AdminPage() {
  const { data: session } = useSession();

  // Basic role check (client-side only, visual)
  if (session && (session.user as any)?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center p-8 bg-gray-900 rounded-2xl border border-gray-800">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">You do not have permission to view the admin dashboard.</p>
          <Link href="/dashboard" className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Shield className="w-10 h-10 text-red-600" />
              Admin Portal
            </h1>
            <p className="text-gray-400 mt-2">Manage users, content, and platform settings.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition">
              Exit Admin
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-900/30 text-blue-400 rounded-lg">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <h3 className="text-2xl font-bold">12,450</h3>
              </div>
            </div>
            <div className="text-xs text-green-400 flex items-center gap-1">
              <span>↑ 12%</span> from last month
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-900/30 text-green-400 rounded-lg">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Active Now</p>
                <h3 className="text-2xl font-bold">843</h3>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Users online
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-900/30 text-purple-400 rounded-lg">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Courses</p>
                <h3 className="text-2xl font-bold">128</h3>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              15 pending approval
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold mb-6">Management Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* User Management */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-red-600/50 transition duration-300 group">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2 group-hover:text-red-500 transition">User Management</h3>
              <p className="text-gray-400 text-sm mb-6">View user details, verify accounts, and manage permissions.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span> Verify Instructors
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span> Ban/Suspend Users
                </li>
              </ul>
              <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition">Manage Users</button>
            </div>
          </div>

          {/* Content Management */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-red-600/50 transition duration-300 group">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2 group-hover:text-red-500 transition">Content & Courses</h3>
              <p className="text-gray-400 text-sm mb-6">Review new courses, moderate comments, and organize categories.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span> Approve Courses
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span> Featured Content
                </li>
              </ul>
              <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition">Manage Content</button>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-red-600/50 transition duration-300 group">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2 group-hover:text-red-500 transition">System Settings</h3>
              <p className="text-gray-400 text-sm mb-6">Configure platform features, API keys, and maintenance mode.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span> Site Configuration
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span> API Logs
                </li>
              </ul>
              <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition">Settings</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}