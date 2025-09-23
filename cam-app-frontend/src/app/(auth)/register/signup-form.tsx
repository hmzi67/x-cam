"use client";
import React, { useState } from "react";
import { useFormStatus } from "react-dom";
import { handleSignUp } from "@/server-actions/auth";

const defaultState = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
};

export default function SignUpForm() {
  const [formState, setFormState] = useState(defaultState);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    status: "error" | "success";
    message: string;
  } | null>();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formState.first_name ||
      !formState.last_name ||
      !formState.email ||
      !formState.password ||
      !formState.confirm_password
    ) {
      setLoading(false);
      setMessage({ message: "All fields are required", status: "error" });
      return;
    }

    if (formState.password !== formState.confirm_password) {
      setLoading(false);
      setMessage({ message: "Passwords do not match", status: "error" });
      return;
    }

    try {
      const res = "password" in formState && (await handleSignUp(formState));
      if (res) {
        setLoading(false);
        setFormState(defaultState);
        setMessage({
          message:
            "Your registration has been successfully submitted. Please wait for your request to be reviewed. You will receive an email notification once it has been approved.",
          status: "success",
        });
      } else
        throw new Error(
          "Something went wrong. Please contact us at itsupport@referralgps.com."
        );
    } catch (err: any) {
      console.log(err.message);
      setMessage({ message: err.message, status: "error" });
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 w-full">
      <div className="relative">
        <input
          className={`w-full rounded bg-[#18181b] border ${
            formState.first_name ? "border-purple-500" : "border-gray-700"
          } text-gray-100 px-4 py-3 text-base focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all peer`}
          required
          name="first_name"
          id="first_name"
          value={formState.first_name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormState({ ...formState, first_name: e.target.value })
          }
          placeholder=" "
          autoFocus
        />
        <label 
          htmlFor="first_name"
          className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#18181b] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-purple-500 left-3"
        >
          First Name
        </label>
      </div>
      
      <div className="relative">
        <input
          className={`w-full rounded bg-[#18181b] border ${
            formState.last_name ? "border-purple-500" : "border-gray-700"
          } text-gray-100 px-4 py-3 text-base focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all peer`}
          required
          name="last_name"
          id="last_name"
          value={formState.last_name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormState({ ...formState, last_name: e.target.value })
          }
          placeholder=" "
        />
        <label 
          htmlFor="last_name"
          className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#18181b] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-purple-500 left-3"
        >
          Last Name
        </label>
      </div>
      
      <div className="relative">
        <input
          className={`w-full rounded bg-[#18181b] border ${
            formState.email ? "border-purple-500" : "border-gray-700"
          } text-gray-100 px-4 py-3 text-base focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all peer`}
          required
          name="email"
          id="email"
          type="email"
          autoComplete="email"
          value={formState.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormState({ ...formState, email: e.target.value })
          }
          placeholder=" "
        />
        <label 
          htmlFor="email"
          className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#18181b] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-purple-500 left-3"
        >
          Email Address
        </label>
      </div>
      
      <div className="relative">
        <input
          className={`w-full rounded bg-[#18181b] border ${
            formState.password ? "border-purple-500" : "border-gray-700"
          } text-gray-100 px-4 py-3 text-base focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all peer`}
          type="password"
          required
          name="password"
          id="password"
          autoComplete="new-password"
          value={formState.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormState({ ...formState, password: e.target.value })
          }
          placeholder=" "
        />
        <label 
          htmlFor="password"
          className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#18181b] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-purple-500 left-3"
        >
          Password
        </label>
        {formState.password && (
          <div className="mt-1 flex items-center">
            <div className="h-1 flex-grow flex space-x-1">
              <div className={`h-full flex-1 rounded ${
                formState.password.length >= 8 ? "bg-green-500" : "bg-gray-700"
              }`}></div>
              <div className={`h-full flex-1 rounded ${
                /[A-Z]/.test(formState.password) ? "bg-green-500" : "bg-gray-700"
              }`}></div>
              <div className={`h-full flex-1 rounded ${
                /[0-9]/.test(formState.password) ? "bg-green-500" : "bg-gray-700"
              }`}></div>
              <div className={`h-full flex-1 rounded ${
                /[!@#$%^&*]/.test(formState.password) ? "bg-green-500" : "bg-gray-700"
              }`}></div>
            </div>
            <span className="ml-2 text-xs text-gray-400">
              {formState.password.length >= 8 && 
               /[A-Z]/.test(formState.password) && 
               /[0-9]/.test(formState.password) && 
               /[!@#$%^&*]/.test(formState.password) 
                ? "Strong" 
                : formState.password.length >= 6 
                  ? "Medium" 
                  : "Weak"}
            </span>
          </div>
        )}
      </div>
      
      <div className="relative">
        <input
          className={`w-full rounded bg-[#18181b] border ${
            formState.confirm_password ? "border-purple-500" : "border-gray-700"
          } text-gray-100 px-4 py-3 text-base focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all peer`}
          type="password"
          required
          name="confirm_password"
          id="confirm_password"
          autoComplete="new-password"
          value={formState.confirm_password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormState({ ...formState, confirm_password: e.target.value })
          }
          placeholder=" "
        />
        <label 
          htmlFor="confirm_password"
          className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#18181b] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-purple-500 left-3"
        >
          Confirm Password
        </label>
      </div>
      
      <div className="flex items-center mb-2 p-3 bg-indigo-900/30 rounded-md border border-indigo-800">
        <svg className="h-5 w-5 text-indigo-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <span className="text-xs text-indigo-300">
          You'll receive a verification email after registration. Please verify your email to activate your account.
        </span>
      </div>
      
      <button
        type="submit"
        className={`w-full py-3 px-4 rounded font-medium text-white focus:outline-none transition-all ${
          loading 
            ? "bg-purple-700 cursor-not-allowed" 
            : "bg-purple-600 hover:bg-purple-700"
        }`}
        disabled={loading}
        onClick={handleSubmit}
      >
        Create Account
      </button>

      {loading && (
        <div className="w-full bg-gray-700 h-1 overflow-hidden rounded">
          <div className="bg-purple-500 h-1 animate-pulse"></div>
        </div>
      )}

      {message?.status === "error" && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{message.message}</span>
        </div>
      )}

      {message?.status === "success" && (
        <div className="bg-green-900/30 border border-green-500 text-green-300 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{message.message}</span>
        </div>
      )}
    </form>
  );
}
