
import { verifyEmailToken } from "@/server-actions/auth";
import Link from "next/link";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams?.token;

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
        <p className="text-gray-400 mb-6">
          Invalid or missing verification token.
        </p>
        <Link href="/login">
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded transition-colors">
            Return to Login
          </button>
        </Link>
      </div>
    );
  }
  
  const verifyEmail = await verifyEmailToken(token);

  if (verifyEmail.success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Email Verified</h2>
        <p className="text-gray-400 mb-6">
          Your email has been successfully verified! You can now log in to your account.
        </p>
        <Link href="/login">
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded transition-colors">
            Log In Now
          </button>
        </Link>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
        <p className="text-gray-400 mb-6">
          We couldn't verify your email address. The token may have expired or is invalid.
        </p>
        <Link href="/register">
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded transition-colors">
            Try Again
          </button>
        </Link>
      </div>
    );
  }
}
