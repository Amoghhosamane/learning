'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');

  // Mock data
  const stats = [
    { label: 'Total Students', value: '1,247', change: '+12%' },
    { label: 'Active Courses', value: '15', change: '+2' },
    { label: 'Monthly Revenue', value: '$24,580', change: '+8%' },
    { label: 'Completion Rate', value: '68%', change: '+5%' }
  ];

  const recentStudents = [
    { name: 'Alex Johnson', email: 'alex@example.com', joined: '2 hours ago', courses: 3 },
    { name: 'Sarah Miller', email: 'sarah@example.com', joined: '5 hours ago', courses: 1 },
    { name: 'Mike Chen', email: 'mike@example.com', joined: '1 day ago', courses: 2 },
    { name: 'Emily Davis', email: 'emily@example.com', joined: '2 days ago', courses: 1 }
  ];

  const courses = [
    { title: 'Web Development Bootcamp', students: 1250, revenue: '$12,450', status: 'Active' },
    { title: 'Data Science Fundamentals', students: 890, revenue: '$7,120', status: 'Active' },
    { title: 'UX/UI Design Masterclass', students: 670, revenue: '$6,030', status: 'Active' },
    { title: 'Python for Beginners', students: 2100, revenue: '$18,900', status: 'Active' }
  ];

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview' },
    { id: 'courses', label: 'Course Management' },
    { id: 'students', label: 'Student Management' },
    { id: 'analytics', label: 'Analytics & Reports' },
    { id: 'content', label: 'Content Management' },
    { id: 'settings', label: 'System Settings' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-red-600 transition duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-400 text-sm font-normal">{stat.label}</div>
                    <span className="text-green-500 text-sm font-normal bg-green-500 bg-opacity-20 px-3 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                  <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                    <div className="bg-red-600 h-1 rounded-full" style={{width: '70%'}}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Students */}
              <div className="bg-gray-900 rounded-2xl border border-gray-800">
                <div className="p-6 border-b border-gray-800">
                  <h3 className="text-xl font-black text-white">Recent Students</h3>
                  <p className="text-gray-400 text-sm mt-1 font-normal">New student registrations</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentStudents.map((student, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition duration-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-black text-sm">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-black text-white">{student.name}</div>
                            <div className="text-gray-400 text-sm font-normal">{student.email}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400 font-normal">{student.joined}</div>
                          <div className="text-xs text-red-400 font-normal">{student.courses} courses enrolled</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-700 font-normal transition duration-200 border border-gray-700">
                    View All Students
                  </button>
                </div>
              </div>

              {/* Popular Courses */}
              <div className="bg-gray-900 rounded-2xl border border-gray-800">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-black text-white">Popular Courses</h3>
                    <p className="text-gray-400 text-sm mt-1 font-normal">Top performing courses</p>
                  </div>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 font-normal transition duration-200">
                    Create New Course
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {courses.map((course, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition duration-200">
                        <div className="flex-1">
                          <div className="font-black text-white">{course.title}</div>
                          <div className="flex space-x-4 text-sm text-gray-400 mt-2 font-normal">
                            <span>{course.students.toLocaleString()} students</span>
                            <span>{course.revenue} revenue</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs rounded-full border border-green-500 border-opacity-30 font-normal">
                            {course.status}
                          </span>
                          <button className="text-gray-400 hover:text-white transition duration-200 text-sm font-normal">
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-700 font-normal transition duration-200 border border-gray-700">
                    View All Courses
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h4 className="font-black text-white mb-4">Platform Health</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-normal">Server Uptime</span>
                    <span className="text-green-400 font-normal">99.9%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-normal">Active Sessions</span>
                    <span className="text-white font-normal">247</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-normal">Storage Used</span>
                    <span className="text-white font-normal">45%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h4 className="font-black text-white mb-4">Recent Activity</h4>
                <div className="space-y-3 text-sm">
                  <div className="text-gray-400 font-normal">New course enrollment - Web Development</div>
                  <div className="text-gray-400 font-normal">Student completed Python course</div>
                  <div className="text-gray-400 font-normal">New instructor registration</div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h4 className="font-black text-white mb-4">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition duration-200 font-normal">
                    Send platform announcement
                  </button>
                  <button className="w-full text-left text-sm text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition duration-200 font-normal">
                    Generate monthly report
                  </button>
                  <button className="w-full text-left text-sm text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition duration-200 font-normal">
                    Manage user permissions
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
            <div className="text-center">
              <h2 className="text-2xl font-black text-white mb-4">Course Management</h2>
              <p className="text-gray-400 mb-8 font-normal">Manage all courses, content, and instructors</p>
              <div className="max-w-md mx-auto space-y-4">
                <button className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 font-normal transition duration-200">
                  Create New Course
                </button>
                <button className="w-full bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-700 font-normal transition duration-200 border border-gray-700">
                  Import Course Content
                </button>
                <button className="w-full bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-700 font-normal transition duration-200 border border-gray-700">
                  Manage Course Categories
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
            <div className="text-center">
              <h2 className="text-2xl font-black text-white mb-4">
                {menuItems.find(item => item.id === activeSection)?.label}
              </h2>
              <p className="text-gray-400 font-normal">This section is currently under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar Navigation */}
<div className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen flex flex-col">
  <div className="p-6 border-b border-gray-800">
    <Link href="/dashboard" className="text-2xl font-black text-red-600 hover:text-red-500 transition duration-200">
      SkillOrbit
    </Link>
    <p className="text-gray-400 text-sm mt-2 font-normal">Administration Panel</p>
  </div>

  {/* Navigation - This will grow to take available space */}
  <div className="flex-1 p-4 space-y-1">
    {menuItems.map((item) => (
      <button
        key={item.id}
        onClick={() => setActiveSection(item.id)}
        className={`w-full text-left px-4 py-3 rounded-xl transition duration-200 font-normal ${
          activeSection === item.id
            ? 'bg-red-600 text-white'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`}
      >
        {item.label}
      </button>
    ))}
  </div>

  {/* User Info - This will stay at the bottom */}
  <div className="p-4 border-t border-gray-800 bg-gray-900">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-sm">
        A
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-black truncate">Administrator</div>
        <div className="text-gray-400 text-xs font-normal truncate">admin@skillorbit.com</div>
      </div>
    </div>
  </div>
</div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-black border-b border-gray-800 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-white">
                {menuItems.find(item => item.id === activeSection)?.label}
              </h1>
              <p className="text-gray-400 text-sm mt-1 font-normal">
                Manage and monitor your SkillOrbit platform
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition duration-200 border border-gray-700 font-normal">
                Need Help?
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-black">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}