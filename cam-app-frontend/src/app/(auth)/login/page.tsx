import Link from "next/link";
import LoginForm from "./login-form";

export default async function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-purple-600 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-purple-200">
            Sign in to your account to continue streaming
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <LoginForm />
          
          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-purple-200">
              Don&apos;t have an account?{" "}
              <Link 
                href="/register"
                className="font-medium text-purple-300 hover:text-purple-100 transition-colors duration-200 underline underline-offset-4"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Additional features */}
        <div className="text-center">
          <p className="text-xs text-purple-300">
            Join thousands of streamers worldwide
          </p>
        </div>
      </div>
    </div>
  );
}
