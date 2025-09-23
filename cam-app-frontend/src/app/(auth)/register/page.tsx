import Link from "next/link";
import SignUpForm from './signup-form';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Join XCams
          </h2>
          <p className="mt-2 text-sm text-purple-200">
            Create your account and start streaming today
          </p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <SignUpForm />
          
          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-purple-200">
              Already have an account?{" "}
              <Link 
                href="/login"
                className="font-medium text-purple-300 hover:text-purple-100 transition-colors duration-200 underline underline-offset-4"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="text-center space-y-2">
          <p className="text-xs text-purple-300">
            ✨ Free to join • 🚀 Start streaming instantly • 💰 Earn from day one
          </p>
        </div>
      </div>
    </div>
  );
}
