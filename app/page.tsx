import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function HomePage() {
  const session = await getServerSession(authOptions as any);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-purple-600/20"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-500 rounded-full blur-xl opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500 rounded-full blur-xl opacity-20"></div>

        <div className="relative z-10 flex flex-col justify-center px-16 w-full">
          <h1 className="text-7xl font-bold text-white mb-6">SkillOrbit</h1>
          <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
            Start your learning journey <br />
            <span className="text-red-400 font-semibold">Join thousands of students</span>{" "}
            and <br />
            <span className="text-purple-400 font-semibold">transform your career</span>
          </p>

          <div className="space-y-4">
            {[
              "Expert-led courses",
              "Hands-on projects",
              "Career certificates",
              "Community support",
              "Learn at your pace",
            ].map((feature, index) => (
              <div key={index} className="flex items-center text-gray-300 text-lg">
                <span className="mr-3">✨</span>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md bg-black bg-opacity-70 backdrop-blur-xl rounded-3xl border border-gray-800 p-10 shadow-2xl">
          
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            Start Your Journey 🚀
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Create your account or sign in to access your learning dashboard.
          </p>

          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="block w-full text-center bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-semibold text-lg transition-transform duration-300 hover:scale-105"
            >
              Sign In
            </Link>

            <Link
              href="/auth/signup"
              className="block w-full text-center bg-gray-900 hover:bg-gray-800 border-2 border-red-600 text-red-400 py-4 rounded-xl font-semibold text-lg transition-transform duration-300 hover:scale-105"
            >
              Create Account
            </Link>
          </div>

        

          <p className="mt-8 text-sm text-center text-gray-500">
            © 2024 SkillOrbit. Start learning today.
          </p>
        </div>
      </div>
    </div>
  );
}
