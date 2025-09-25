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
  
  // Add keyframes for animations if not already present - enhanced to match Sidebar effects
  if (typeof document !== 'undefined') {
    const existingStyle = document.getElementById('header-animations');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'header-animations';
      style.textContent = `
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(192, 38, 211, 0.6); }
          50% { box-shadow: 0 0 25px rgba(192, 38, 211, 0.9); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  return (
    <header className="w-full bg-[#1a1a1a] border-b border-[#222] shadow-lg z-20 sticky top-0 relative overflow-hidden">
      {/* Background glow effects similar to Sidebar ambient lighting */}
      <div className="absolute top-0 left-1/4 w-64 h-full rounded-full bg-fuchsia-900/20 blur-2xl animate-pulse"></div>
      <div className="absolute top-0 right-1/4 w-64 h-full rounded-full bg-purple-900/20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-0 left-1/2 w-32 h-8 -translate-x-1/2 rounded-full bg-purple-600/30 blur-xl opacity-70"></div>
      
      <div className="max-w-screen-2xl mx-auto flex items-center px-2 md:px-4 lg:px-6 py-3 gap-4 relative">
        
        {/* Logo - Enhanced with stronger glow similar to Sidebar */}
        <Link href="/" className="flex items-center group relative z-10 overflow-hidden">
          <div className="text-2xl font-bold text-white flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center mr-2 relative overflow-hidden">
              {/* Enhanced pulsing glow effect */}
              <div className="absolute inset-0 rounded-full shadow-[0_0_15px_5px_rgba(192,38,211,0.8)] animate-[pulse-glow_2s_ease-in-out_infinite] group-hover:shadow-[0_0_25px_8px_rgba(192,38,211,0.9)]"></div>
              
              {/* Animated shine effect */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-70 animate-[shine_2s_ease-in-out_infinite]"></div>
              
              {/* Logo icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white relative z-10 drop-shadow-[0_0_3px_rgba(255,255,255,0.9)] group-hover:animate-[float-subtle_2s_ease-in-out_infinite]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="relative group-hover:text-fuchsia-100 transition-colors duration-300 text-shadow-glow">
              XCAMS
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500/30 via-fuchsia-500/90 to-purple-500/30 shadow-[0_0_8px_rgba(192,38,211,0.8)] opacity-80"></span>
            </span>
          </div>
          
          {/* Strong outer glow effect like Sidebar */}
          <span className="absolute inset-0 shadow-[0_0_20px_5px_rgba(192,38,211,0.5)] opacity-70"></span>
          
          {/* Additional shine effect across entire link */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></span>
        </Link>

        {/* Main Navigation - Enhanced with glowing active state similar to Sidebar */}
        <nav className="hidden md:flex space-x-1 ml-6 relative z-10">
          <Link href="/" className="text-white font-medium hover:text-white px-4 py-2 relative group overflow-hidden bg-gradient-to-r from-purple-600 to-fuchsia-600">
            {/* Strong outer glow effect similar to Sidebar */}
            <span className="absolute inset-0 shadow-[0_0_15px_3px_rgba(192,38,211,0.7)] animate-pulse"></span>
            
            {/* Text with glow */}
            <span className="relative z-10 drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]">Girls</span>
            
            {/* Animated shine effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_1.5s_ease-in-out_infinite] opacity-50"></span>
          </Link>
          
          <Link href="/guys" className="text-[#bbb] hover:text-white px-4 py-2 hover:bg-gradient-to-r hover:from-purple-600/70 hover:to-fuchsia-600/70 relative group">
            {/* Glow effect on hover like in Sidebar */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_10px_2px_rgba(192,38,211,0.5)] transition-all duration-300"></span>
            
            {/* Text with conditional glow */}
            <span className="relative z-10 group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.6)] transition-all duration-300">Guys</span>
            
            {/* Animated shine effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></span>
          </Link>
          
          <Link href="/trans" className="text-[#bbb] hover:text-white px-4 py-2 hover:bg-gradient-to-r hover:from-purple-600/70 hover:to-fuchsia-600/70 relative group">
            {/* Glow effect on hover like in Sidebar */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_10px_2px_rgba(192,38,211,0.5)] transition-all duration-300"></span>
            
            {/* Text with conditional glow */}
            <span className="relative z-10 group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.6)] transition-all duration-300">Trans</span>
            
            {/* Animated shine effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></span>
          </Link>
        </nav>
        
        {/* Search Bar - Enhanced with glow effect wrapper */}
        <div className="flex-1 max-w-xl relative group/search">
          {/* Subtle background glow effect that activates on hover */}
          <div className="absolute -inset-1 rounded-md bg-gradient-to-r from-purple-600/0 to-fuchsia-600/0 group-hover/search:from-purple-600/20 group-hover/search:to-fuchsia-600/20 opacity-0 group-hover/search:opacity-100 blur-md transition-all duration-300"></div>
          
          {/* SearchBar component */}
          <div className="relative z-10">
            <SearchBar />
          </div>
        </div>
        
        {/* Action Buttons - Enhanced with stronger glowing effects similar to Sidebar */}
        <div className="flex items-center gap-2 relative z-10">
          {user?.id ? (
            <>
              {/* CreateStreamButton with enhanced glow effect similar to Sidebar active items */}
              <div className="relative group">
                {/* Strong outer glow effect */}
                <div className="absolute -inset-0.5 rounded-sm bg-gradient-to-r from-purple-600/70 to-fuchsia-600/70 opacity-70 blur-sm animate-[pulse-glow_2s_ease-in-out_infinite]"></div>
                
                <div className="relative">
                  <CreateStreamButton categories={categories} />
                </div>
                
                {/* Enhanced shine effect */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_2s_ease-in-out_infinite] opacity-50"></div>
              </div>
              
              {/* User Profile - Enhanced with stronger pulsing glow */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1 p-1.5 hover:bg-gradient-to-r hover:from-purple-600/70 hover:to-fuchsia-600/70 rounded-md transition-all duration-300 relative group overflow-hidden"
                >
                  {/* Strong outer glow effect on hover */}
                  <span className="absolute inset-0 rounded-md shadow-[0_0_0px_rgba(192,38,211,0)] group-hover:shadow-[0_0_20px_5px_rgba(192,38,211,0.6)] opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  
                  {/* Avatar container with enhanced glow */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center overflow-hidden relative">
                    {/* Stronger pulsing glow effect */}
                    <span className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(192,38,211,0.7)] group-hover:shadow-[0_0_20px_rgba(192,38,211,0.9)] animate-[pulse-glow_3s_ease-in-out_infinite] transition-all duration-300"></span>
                    
                    {/* Enhanced shine effect */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-70 animate-[shine_2s_ease-in-out_infinite]"></span>
                    
                    {/* User avatar or initial */}
                    {user?.avatar ? (
                      <Image 
                        src={user.avatar} 
                        alt="User Avatar" 
                        width={32} 
                        height={32}
                        className="w-full h-full object-cover relative z-10"
                      />
                    ) : (
                      <span className="text-white text-sm font-medium relative z-10 drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#18181B] rounded-md py-1 z-50 border border-[#2D2D35] shadow-[0_0_20px_rgba(0,0,0,0.4)] animate-modalFadeIn overflow-hidden">
                    {/* Enhanced purple/fuchsia glow on the dropdown - stronger like Sidebar */}
                    <div className="absolute -inset-px rounded-md bg-gradient-to-b from-fuchsia-500/40 via-purple-500/20 to-transparent opacity-90 animate-[pulse-glow_4s_ease-in-out_infinite]"></div>
                    
                    {/* Menu header with stronger glow */}
                    <div className="px-4 py-2 border-b border-[#2D2D35] relative bg-gradient-to-r from-[#1a1925] to-[#18181B]">
                      <p className="text-white font-medium drop-shadow-[0_0_3px_rgba(217,70,219,0.7)]">{user?.username}</p>
                    </div>
                    
                    {/* Enhanced menu items with stronger hover effects like Sidebar */}
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-fuchsia-600/30 hover:text-white transition-all duration-200 relative group/item overflow-hidden">
                      <span className="relative z-10 group-hover/item:drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]">Dashboard</span>
                      <span className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/60 to-transparent opacity-0 group-hover/item:opacity-100 transition-all duration-300 group-hover/item:shadow-[0_0_5px_rgba(192,38,211,0.7)]"></span>
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/item:opacity-100 group-hover/item:animate-[shine_1.5s_ease-in-out_infinite]"></span>
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-fuchsia-600/30 hover:text-white transition-all duration-200 relative group/item overflow-hidden">
                      <span className="relative z-10 group-hover/item:drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]">Settings</span>
                      <span className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/60 to-transparent opacity-0 group-hover/item:opacity-100 transition-all duration-300 group-hover/item:shadow-[0_0_5px_rgba(192,38,211,0.7)]"></span>
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/item:opacity-100 group-hover/item:animate-[shine_1.5s_ease-in-out_infinite]"></span>
                    </Link>
                    
                    {/* Enhanced logout button with hover glow */}
                    <div className="border-t border-[#2D2D35] mt-1 relative">
                      <LogoutButton className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-fuchsia-600/30 hover:text-white transition-all duration-200 relative" />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* JOIN FREE button - Enhanced with stronger glow and animation similar to Sidebar */}
              <Link
                href="/register"
                className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold px-5 py-2 rounded-sm uppercase text-sm relative group overflow-hidden"
              >
                {/* Strong outer glow effect always visible */}
                <span className="absolute -inset-0.5 rounded-sm bg-gradient-to-r from-yellow-400 to-amber-400 opacity-80 blur-sm animate-[pulse-glow_2s_ease-in-out_infinite]"></span>
                
                {/* Enhanced inner shadow glow */}
                <span className="absolute inset-0 shadow-[0_0_15px_rgba(250,204,21,0.7)] animate-pulse transition-all duration-300"></span>
                
                {/* Always visible animated shine effect */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_1.5s_ease-in-out_infinite] opacity-70"></span>
                
                {/* Text with stronger drop shadow */}
                <span className="relative z-10 drop-shadow-[0_0_2px_rgba(0,0,0,0.7)]">JOIN FREE</span>
              </Link>
              
              {/* Login button - Enhanced with stronger glow similar to Sidebar hover states */}
              <Link
                href="/login"
                className="bg-[#1F1F23] hover:bg-gradient-to-r hover:from-purple-600/70 hover:to-fuchsia-600/70 text-[#bbb] hover:text-white font-medium px-5 py-2 rounded-sm transition-all duration-300 text-sm relative group overflow-hidden"
              >
                {/* Enhanced outer glow on hover */}
                <span className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_15px_5px_rgba(192,38,211,0.5)] transition-all duration-300"></span>
                
                {/* Shine effect */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></span>
                
                {/* Text with glow on hover */}
                <span className="relative z-10 group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.7)] transition-all duration-300">Log In</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
