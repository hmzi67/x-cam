"use client";
import Sidebar from "@/components/Sidebar";
import Filters from "@/components/Filters";
import StreamGrid from "@/components/StreamGrid";
import Header from "./Header";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { getUser } from "@/lib/features/userSlice";
import { Categories, Streams } from "@/types/Schema";

export default function Landing({
  streams,
  categories,
}: {
  streams: Streams[];
  categories: Categories[];
}) {
  const userState = useAppSelector(getUser);
  const isLoggedIn = !!userState?.id;
  const balance = 0;
  const [isMounted, setIsMounted] = useState(false);
  const [selectedView, setSelectedView] = useState<'grid' | 'small' | 'large'>('grid');
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Filter handler for Filters component
  const handleFilterChange = (key: string, value: string) => {
    const query = new URLSearchParams();
    if (value) query.set(key, value);
    window.location.href = `/stream?${query.toString()}`;
  };
  
  if (!isMounted) return null;
  
  return (
    <div className="min-h-screen bg-[#0E0E10] text-white flex flex-col">
      {/* Header */}
      <Header categories={categories || []} />
      
      {/* Filter Navigation */}
      <div className="bg-[#18181B] border-b border-[#222] px-4 py-1">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="text-sm text-fuchsia-400 border-b-2 border-fuchsia-500 py-2 px-1 relative overflow-hidden group">
              {/* Enhanced stronger glow effect under the text and border */}
              <span className="absolute inset-0 -bottom-0.5 shadow-[0_0_20px_8px_rgba(192,38,211,0.8)] animate-[pulse-glow_2s_ease-in-out_infinite]"></span>
              
              {/* Text with enhanced glow */}
              <span className="relative z-10 font-medium drop-shadow-[0_0_5px_rgba(217,70,255,1)]">All Girls Cams</span>
              
              {/* Enhanced animated shine effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-fuchsia-400/40 to-transparent animate-[shine_1.5s_ease-in-out_infinite]"></span>
              
              {/* Extra bottom border glow */}
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-500/60 via-fuchsia-400 to-fuchsia-500/60 shadow-[0_0_15px_rgba(217,70,219,0.9)]"></span>
            </div>
            <div className="text-sm text-fuchsia-400 relative">
              <span className="text-xs absolute -top-1 -right-1.5 bg-fuchsia-500 text-white rounded-full h-3 w-3 flex items-center justify-center shadow-[0_0_5px_rgba(192,38,211,0.7)]">
                i
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className={`p-1 relative transition-all duration-300 overflow-hidden ${
                selectedView === 'small' 
                  ? 'bg-[#2D2D35] text-fuchsia-400' 
                  : 'text-gray-400 hover:text-fuchsia-300'
              }`}
              onClick={() => setSelectedView('small')}
            >
              {/* Enhanced glow effect when selected */}
              {selectedView === 'small' && (
                <>
                  <span className="absolute inset-0 shadow-[0_0_12px_rgba(192,38,211,0.6)] rounded animate-pulse"></span>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-fuchsia-400/20 to-transparent animate-[shine_2s_ease-in-out_infinite]"></span>
                </>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 relative z-10 ${
                selectedView === 'small' ? 'drop-shadow-[0_0_3px_rgba(192,38,211,0.9)]' : ''
              }`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              className={`p-1 relative transition-all duration-300 ${
                selectedView === 'grid' 
                  ? 'bg-[#2D2D35] text-fuchsia-400' 
                  : 'text-gray-400 hover:text-fuchsia-300'
              }`}
              onClick={() => setSelectedView('grid')}
            >
              {selectedView === 'grid' && (
                <span className="absolute inset-0 shadow-[0_0_8px_rgba(192,38,211,0.4)] rounded"></span>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 relative z-10 ${
                selectedView === 'grid' ? 'drop-shadow-[0_0_2px_rgba(192,38,211,0.7)]' : ''
              }`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
            </button>
            <button 
              className={`p-1 relative transition-all duration-300 ${
                selectedView === 'large' 
                  ? 'bg-[#2D2D35] text-fuchsia-400' 
                  : 'text-gray-400 hover:text-fuchsia-300'
              }`}
              onClick={() => setSelectedView('large')}
            >
              {selectedView === 'large' && (
                <span className="absolute inset-0 shadow-[0_0_8px_rgba(192,38,211,0.4)] rounded"></span>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 relative z-10 ${
                selectedView === 'large' ? 'drop-shadow-[0_0_2px_rgba(192,38,211,0.7)]' : ''
              }`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 w-full">
        {/* Sidebar */}
        <aside className="hidden md:block w-52 bg-[#18181B] border-r border-[#222] p-0">
          <Sidebar categories={categories || []} />
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-4 bg-[#0E0E10]">
          {/* Enhanced Filters Row with stronger glow effects */}
          <div className="mb-6 flex flex-wrap gap-3 relative">
            {/* Background glow effect */}
            <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-purple-600/0 via-fuchsia-600/5 to-purple-600/0 blur-xl"></div>
            
            {/* Enhanced Regions filter */}
            <button className="bg-gradient-to-r from-[#1F1F23] to-[#252429] text-gray-300 hover:text-white px-3.5 py-2 text-sm rounded-md flex items-center transition-all duration-300 relative group overflow-hidden">
              {/* Enhanced glow effect */}
              <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_15px_rgba(192,38,211,0.6)] transition-all duration-300"></span>
              
              {/* Background hover effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-fuchsia-600/0 group-hover:from-purple-600/30 group-hover:to-fuchsia-600/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></span>
              
              {/* Animated shine effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></span>
              
              {/* Icon with glow */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors duration-300 relative z-10 group-hover:drop-shadow-[0_0_2px_rgba(217,70,219,0.7)]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              
              {/* Text with enhanced hover effect */}
              <span className="relative z-10 group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Regions</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-2 relative z-10 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Enhanced Age filter */}
            <button className="bg-gradient-to-r from-[#1F1F23] to-[#252429] text-gray-300 hover:text-white px-3.5 py-2 text-sm rounded-md flex items-center transition-all duration-300 relative group overflow-hidden">
              <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_15px_rgba(192,38,211,0.6)] transition-all duration-300"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-fuchsia-600/0 group-hover:from-purple-600/30 group-hover:to-fuchsia-600/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors duration-300 relative z-10 group-hover:drop-shadow-[0_0_2px_rgba(217,70,219,0.7)]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a4 4 0 00-3 3.87V9H2a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2H5v-.13A2 2 0 017 7h1V6zm10 2h-1V9a1 1 0 10-2 0v2h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2z" clipRule="evenodd" />
              </svg>
              <span className="relative z-10 group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Age</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-2 relative z-10 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Enhanced Ethnicity filter with active state */}
            <button className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-3.5 py-2 text-sm rounded-md flex items-center relative group overflow-hidden">
              {/* Strong glow effect for active filter */}
              <span className="absolute inset-0 rounded-md shadow-[0_0_15px_rgba(192,38,211,0.7)] animate-[pulse-glow_3s_ease-in-out_infinite]"></span>
              
              {/* Animated shine effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine_2s_ease-in-out_infinite] opacity-60"></span>
              
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.8)] relative z-10" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span className="relative z-10 font-medium drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]">Ethnicity</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-2 relative z-10 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Enhanced Features filter */}
            <button className="bg-gradient-to-r from-[#1F1F23] to-[#252429] text-gray-300 hover:text-white px-3.5 py-2 text-sm rounded-md flex items-center transition-all duration-300 relative group overflow-hidden">
              <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_15px_rgba(192,38,211,0.6)] transition-all duration-300"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-fuchsia-600/0 group-hover:from-purple-600/30 group-hover:to-fuchsia-600/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors duration-300 relative z-10 group-hover:drop-shadow-[0_0_2px_rgba(217,70,219,0.7)]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="relative z-10 group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Features</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-2 relative z-10 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Enhanced Fetishes filter */}
            <button className="bg-gradient-to-r from-[#1F1F23] to-[#252429] text-gray-300 hover:text-white px-3.5 py-2 text-sm rounded-md flex items-center transition-all duration-300 relative group overflow-hidden">
              <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_15px_rgba(192,38,211,0.6)] transition-all duration-300"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-fuchsia-600/0 group-hover:from-purple-600/30 group-hover:to-fuchsia-600/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors duration-300 relative z-10 group-hover:drop-shadow-[0_0_2px_rgba(217,70,219,0.7)]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="relative z-10 group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Fetishes</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-2 relative z-10 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Enhanced Language filter */}
            <button className="bg-gradient-to-r from-[#1F1F23] to-[#252429] text-gray-300 hover:text-white px-3.5 py-2 text-sm rounded-md flex items-center transition-all duration-300 relative group overflow-hidden">
              <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_15px_rgba(192,38,211,0.6)] transition-all duration-300"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-fuchsia-600/0 group-hover:from-purple-600/30 group-hover:to-fuchsia-600/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors duration-300 relative z-10 group-hover:drop-shadow-[0_0_2px_rgba(217,70,219,0.7)]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
              </svg>
              <span className="relative z-10 group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Language</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-2 relative z-10 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {/* Stream Grid */}
          <StreamGrid
            streams={streams || []}
            isLoggedIn={isLoggedIn}
            balance={balance}
          />
        </main>
      </div>
      
    </div>
  );
}
