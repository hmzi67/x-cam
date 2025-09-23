import Link from 'next/link'
import React from 'react'
import SignUpForm from './signup-form'

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-white mb-1">
          Create Account
        </h1>
        <p className="text-sm text-gray-400">
          Please complete the form to create your account
        </p>
      </div>
      
      <SignUpForm />
      
      <div className="flex justify-center mt-4 text-sm">
        <span className="text-gray-400 mr-1">
          Already have an account?
        </span>
        <Link 
          href="/login"
          className="text-purple-500 hover:text-purple-400 transition-colors font-medium"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}
