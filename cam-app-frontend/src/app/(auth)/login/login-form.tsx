"use client";

import {
  loginMfaGeneration,
  loginMfaVerification,
} from "@/server-actions/auth";
import { useFormState } from "react-dom";
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

  const handleSubmit = async (e: any) => {
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
  }, [userState]);

  return (
    <form className="space-y-4 w-full">
      <div className="relative">
        <input
          className={`w-full rounded bg-[#18181b] border ${
            formState.email 
              ? "border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]" 
              : "border-gray-700"
          } text-gray-100 px-4 py-3 text-base focus:outline-none focus:border-fuchsia-500 focus:shadow-[0_0_15px_rgba(192,38,211,0.5)] transition-all duration-300 peer`}
          required
          name="email"
          id="email"
          autoComplete="email"
          value={formState.email}
          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
          placeholder=" "
          autoFocus
        />
        <label 
          htmlFor="email"
          className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#18181b] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-fuchsia-400 left-3"
        >
          Email Address
        </label>
      </div>
      
      {!mfa && (
        <div className="relative">
          <input
            className={`w-full rounded bg-[#18181b] border ${
              formState.password 
                ? "border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]" 
                : "border-gray-700"
            } text-gray-100 px-4 py-3 text-base focus:outline-none focus:border-fuchsia-500 focus:shadow-[0_0_15px_rgba(192,38,211,0.5)] transition-all duration-300 peer`}
            type="password"
            required
            name="password"
            id="password"
            value={formState.password}
            onChange={(e) =>
              setFormState({ ...formState, password: e.target.value })
            }
            autoComplete="current-password"
            placeholder=" "
          />
          <label 
            htmlFor="password"
            className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#18181b] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-fuchsia-400 left-3"
          >
            Password
          </label>
        </div>
      )}
      
      {!mfa && (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              onChange={(e) =>
                setFormState({ ...formState, remember: e.target.checked })
              }
              checked={formState.remember}
              className="h-4 w-4 rounded border-gray-700 bg-[#18181b] text-fuchsia-500 focus:ring-fuchsia-500 focus:ring-offset-0 focus:ring-2 focus:shadow-[0_0_5px_rgba(192,38,211,0.5)]"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-300 hover:text-fuchsia-300 transition-colors">
              Remember me
            </label>
          </div>
          <a 
            href="#" 
            className="text-sm text-fuchsia-500 hover:text-fuchsia-400 transition-colors relative group"
            onClick={(e) => {
              e.preventDefault();
              // Implement forgot password logic here
              alert("Forgot password functionality will be implemented soon.");
            }}
          >
            Forgot password?
            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/90 to-purple-500/0 group-hover:w-full transition-all duration-300"></span>
          </a>
        </div>
      )}
      
      {mfa && (
        <>
          <p className="text-sm text-gray-300 mt-2">
            Please check your inbox and paste the code you received in the email
            below:
          </p>
          <div className="relative">
            <input
              className={`w-full rounded bg-[#18181b] border ${
                formState.mfa_code ? "border-purple-500" : "border-gray-700"
              } text-gray-100 px-4 py-3 text-base focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all peer`}
              required
              id="mfa_code"
              name="mfa_code"
              autoComplete="off"
              autoFocus
              value={formState.mfa_code}
              placeholder=" "
              onChange={(e) =>
                setFormState({ ...formState, mfa_code: e.target.value })
              }
            />
            <label 
              htmlFor="mfa_code"
              className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#18181b] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-purple-500 left-3"
            >
              MFA Code
            </label>
          </div>
        </>
      )}
      
      <button
        type="submit"
        className={`w-full py-3 px-4 rounded font-medium text-white focus:outline-none transition-all duration-300 relative overflow-hidden group ${
          loading 
            ? "bg-purple-700 cursor-not-allowed" 
            : "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700"
        }`}
        disabled={loading}
        onClick={handleSubmit}
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-fuchsia-600/0 via-fuchsia-600/30 to-purple-600/0 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></span>
        <span className="relative z-10">
          {mfa ? "Verify Code" : "Log In"}
        </span>
        <span className="absolute inset-0 w-full h-full shadow-[0_0_15px_rgba(192,38,211,0.5)] group-hover:shadow-[0_0_25px_rgba(192,38,211,0.7)] opacity-75 transition-all duration-300"></span>
      </button>
      
      {!mfa && (
        <>
          <div className="relative flex items-center my-4">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-3 text-gray-400 text-sm bg-[#18181b] px-2 relative">
              OR CONTINUE WITH
              <span className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></span>
            </span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="button"
              className="flex-1 flex items-center justify-center py-2 px-4 border border-gray-700 rounded-md bg-[#18181b] hover:bg-gray-800 transition-all duration-300 relative group"
              onClick={() => alert("Google login will be implemented soon.")}
            >
              <span className="absolute inset-0 rounded-md group-hover:shadow-[0_0_8px_rgba(192,38,211,0.3)] opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center py-2 px-4 border border-gray-700 rounded-md bg-[#18181b] hover:bg-gray-800 transition-all duration-300 relative group"
              onClick={() => alert("Twitter/X login will be implemented soon.")}
            >
              <span className="absolute inset-0 rounded-md group-hover:shadow-[0_0_8px_rgba(192,38,211,0.3)] opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center py-2 px-4 border border-gray-700 rounded-md bg-[#18181b] hover:bg-gray-800 transition-all duration-300 relative group"
              onClick={() => alert("Discord login will be implemented soon.")}
            >
              <span className="absolute inset-0 rounded-md group-hover:shadow-[0_0_8px_rgba(192,38,211,0.3)] opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              <svg className="w-5 h-5 text-[#5865F2] group-hover:text-[#5d6bf2] transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.393-.111.804-.201 1.16-.636-.093-1.277-.14-1.93-.14-.654 0-1.294.047-1.93.14-.09-.356-.191-.767-.21-1.16a.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.49a.07.07 0 0 0-.032.028C2.514 11.924 1.89 19.055 5.513 22.554a.08.08 0 0 0 .042.028c1.632.83 3.216 1.334 4.772 1.667a.075.075 0 0 0 .083-.035c.38-.645.734-1.323 1.03-2.035a.076.076 0 0 0-.041-.106 12.37 12.37 0 0 1-1.772-.842.077.077 0 0 1-.008-.127c.119-.088.237-.18.351-.274a.074.074 0 0 1 .078-.01c3.952 1.784 8.237 1.784 12.151 0a.074.074 0 0 1 .078.01c.114.094.232.186.351.274a.077.077 0 0 1-.008.127 12.31 12.31 0 0 1-1.771.842.076.076 0 0 0-.041.106c.302.708.654 1.39 1.03 2.035a.075.075 0 0 0 .083.035c1.562-.33 3.146-.838 4.778-1.667a.08.08 0 0 0 .042-.028c4.213-4.31 3.82-11.392 1.213-16.034a.06.06 0 0 0-.03-.028zm-9.296 12.89c-.95 0-1.73-.852-1.73-1.892s.765-1.892 1.73-1.892c.971 0 1.736.852 1.736 1.892s-.765 1.892-1.736 1.892zm6.459 0c-.95 0-1.73-.852-1.73-1.892s.765-1.892 1.73-1.892c.971 0 1.736.852 1.736 1.892s-.76 1.892-1.736 1.892z"/>
              </svg>
            </button>
          </div>
        </>
      )}

      {loading && (
        <div className="w-full bg-gray-800 h-1 overflow-hidden rounded relative mt-4">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-fuchsia-600/20 to-purple-600/20"></div>
          <div className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 h-full w-1/3 rounded animate-[shimmer_1.5s_infinite]"></div>
        </div>
      )}

      {error?.status === "error" && (
        <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded relative mt-4 shadow-[0_0_10px_rgba(239,68,68,0.3)]" role="alert">
          <span className="block sm:inline">{error?.message}</span>
        </div>
      )}
    </form>
  );
}
