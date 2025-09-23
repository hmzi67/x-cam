"use client";

import {
  loginMfaGeneration,
  loginMfaVerification,
} from "@/server-actions/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getUser, updateUser } from "@/lib/features/userSlice";
import { setSessionCookie } from "@/app/actions/session";

export interface LoginFormData {
  email: string;
  password: string;
  mfa_code: string;
  remember: boolean;
}

export default function LoginForm() {
  const router = useRouter();
  const userState = useAppSelector(getUser);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    status: string;
    message: string;
  } | null>();
  const [formState, setFormState] = useState<LoginFormData>({
    email: "",
    password: "",
    mfa_code: "",
    remember: false,
  });
  const [mfa, setMfa] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mfa) {
      const res = await loginMfaVerification(formState);
      if (res.success) {
        await setSessionCookie(res.data);
        dispatch(updateUser(res.data));
      } else {
        setError({ message: res.data as string, status: "error" });
        setLoading(false);
      }
    } else {
      const res = await loginMfaGeneration(formState);
      if (res.success) {
        setMfa(true);
        setLoading(false);
        setError(null);
      } else {
        setError({ message: res.data as string, status: "error" });
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (userState?.access_token) {
      router.push("/");
    }
  }, [userState, router]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formState.email}
          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          placeholder="Enter your email"
        />
      </div>

      {/* Password Field */}
      {!mfa && (
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formState.password}
            onChange={(e) => setFormState({ ...formState, password: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter your password"
          />
        </div>
      )}

      {/* Remember Me Checkbox */}
      {!mfa && (
        <div className="flex items-center">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            checked={formState.remember}
            onChange={(e) => setFormState({ ...formState, remember: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-purple-200">
            Remember me
          </label>
        </div>
      )}

      {/* MFA Code Field */}
      {mfa && (
        <div className="space-y-4">
          <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
            <p className="text-sm text-blue-200">
              Please check your inbox and enter the verification code below:
            </p>
          </div>
          <div>
            <label htmlFor="mfa_code" className="block text-sm font-medium text-white mb-2">
              Verification Code
            </label>
            <input
              id="mfa_code"
              name="mfa_code"
              type="text"
              required
              value={formState.mfa_code}
              onChange={(e) => setFormState({ ...formState, mfa_code: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center tracking-widest"
              placeholder="Enter 6-digit code"
              maxLength={6}
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </div>
        ) : (
          "Sign In"
        )}
      </button>

      {/* Error Message */}
      {error?.status === "error" && (
        <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
          <p className="text-sm text-red-200 text-center">{error?.message}</p>
        </div>
      )}
    </form>
  );
}
