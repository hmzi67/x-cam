"use client";
import React, { useState } from "react";
import { handleSignUp } from "@/server-actions/auth";

const defaultState = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
};

export default function SignUpForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    message: string;
    status: "success" | "error";
  } | null>(null);
  const [formState, setFormState] = useState(defaultState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Basic validation
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
      setMessage({ message: "Passwords do not match", status: "error" });
      setLoading(false);
      return;
    }

    try {
      const result = await handleSignUp(formState);
      if (result) {
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setMessage({ message: errorMessage, status: "error" });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* First Name */}
      <div>
        <label htmlFor="first_name" className="block text-sm font-medium text-white mb-2">
          First Name
        </label>
        <input
          id="first_name"
          name="first_name"
          type="text"
          required
          value={formState.first_name}
          onChange={(e) => setFormState({ ...formState, first_name: e.target.value })}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          placeholder="Enter your first name"
        />
      </div>

      {/* Last Name */}
      <div>
        <label htmlFor="last_name" className="block text-sm font-medium text-white mb-2">
          Last Name
        </label>
        <input
          id="last_name"
          name="last_name"
          type="text"
          required
          value={formState.last_name}
          onChange={(e) => setFormState({ ...formState, last_name: e.target.value })}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          placeholder="Enter your last name"
        />
      </div>

      {/* Email */}
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

      {/* Password */}
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
          placeholder="Create a password"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirm_password" className="block text-sm font-medium text-white mb-2">
          Confirm Password
        </label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          required
          value={formState.confirm_password}
          onChange={(e) => setFormState({ ...formState, confirm_password: e.target.value })}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          placeholder="Confirm your password"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating account...
          </div>
        ) : (
          "Create Account"
        )}
      </button>

      {/* Success/Error Messages */}
      {message?.status && (
        <div className={`p-4 rounded-lg border ${
          message.status === "success" 
            ? "bg-green-500/20 border-green-400/30 text-green-200" 
            : "bg-red-500/20 border-red-400/30 text-red-200"
        }`}>
          <p className="text-sm text-center">{message?.message}</p>
        </div>
      )}
    </form>
  );
}