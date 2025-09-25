"use client";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import LogoutButton from "./LogoutButton";
import { useAppSelector } from "@/lib/hooks";
import { getUser } from "@/lib/features/userSlice";
import { Categories } from "@/types/Schema";
import CreateStreamButton from "./CreateStreamButton";
import { useState } from "react";

export default function Header({ categories }: { categories: Categories[] }) {
  const user = useAppSelector(getUser);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  return (
    <header className="w-full bg-[#0E0E10] border-b border-[#18181B] shadow-lg z-20 sticky top-0">
      <div className="max-w-screen-2xl mx-auto flex items-center px-2 md:px-4 lg:px-6 py-3 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="text-2xl font-bold text-white flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
            XCAMS
          </div>
        </Link>

        {/* Main Navigation */}
        <nav className="hidden md:flex space-x-4 ml-6">
          <Link href="/" className="text-white font-medium hover:text-gray-300 transition">
            Girls
          </Link>
          <Link href="/guys" className="text-white hover:text-gray-300 transition">
            Guys
          </Link>
          <Link href="/trans" className="text-white hover:text-gray-300 transition">
            Trans
          </Link>
        </nav>
        
        {/* Search Bar - Full flex on larger screens, smaller on mobile */}
        <div className="flex-1 max-w-xl">
          <SearchBar />
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {user?.id ? (
            <>
              <CreateStreamButton categories={categories} />
              
              {/* User Profile */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1 p-1 hover:bg-[#18181B] rounded-md transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <Image 
                        src={user.avatar} 
                        alt="User Avatar" 
                        width={32} 
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-medium">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#18181B] rounded-md shadow-lg py-1 z-50 border border-[#2D2D35]">
                    <div className="px-4 py-2 border-b border-[#2D2D35]">
                      <p className="text-white font-medium">{user?.username}</p>
                    </div>
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#26262C] hover:text-white">
                      Dashboard
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#26262C] hover:text-white">
                      Settings
                    </Link>
                    <div className="border-t border-[#2D2D35] mt-1">
                      <LogoutButton className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#26262C] hover:text-white" />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-5 py-2 rounded-sm uppercase text-sm"
              >
                JOIN FREE
              </Link>
              <Link
                href="/login"
                className="bg-[#1F1F23] hover:bg-[#2D2D35] text-white font-medium px-5 py-2 rounded-sm transition text-sm"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
