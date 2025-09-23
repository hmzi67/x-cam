import Link from "next/link";
import LoginForm from "./login-form";

export default async function LoginPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-white mb-1">
          Welcome 👋🏻
        </h1>
        <p className="text-sm text-gray-400">
          Please sign-in to your account
        </p>
      </div>
      
      <LoginForm />
      
      <div className="flex justify-center mt-4 text-sm">
        <span className="text-gray-400 mr-1">
          Don&apos;t have an account?
        </span>
        <Link 
          href="/register"
          className="text-purple-500 hover:text-purple-400 transition-colors font-medium"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
