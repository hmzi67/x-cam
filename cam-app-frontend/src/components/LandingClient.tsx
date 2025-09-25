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
            <div className="text-sm text-purple-500 border-b-2 border-purple-500 py-2 px-1">All Girls Cams</div>
            <div className="text-sm text-purple-500 relative">
              <span className="text-xs absolute -top-1 -right-1.5 bg-purple-500 text-white rounded-full h-3 w-3 flex items-center justify-center">
                i
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className={`p-1 ${selectedView === 'small' ? 'bg-[#2D2D35] text-white' : 'text-gray-400'}`}
              onClick={() => setSelectedView('small')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              className={`p-1 ${selectedView === 'grid' ? 'bg-[#2D2D35] text-white' : 'text-gray-400'}`}
              onClick={() => setSelectedView('grid')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
            </button>
            <button 
              className={`p-1 ${selectedView === 'large' ? 'bg-[#2D2D35] text-white' : 'text-gray-400'}`}
              onClick={() => setSelectedView('large')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
          {/* Filters Row */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button className="bg-[#1F1F23] text-gray-300 hover:bg-[#2D2D35] px-3 py-1.5 text-sm rounded-sm flex items-center">
              Regions
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="bg-[#1F1F23] text-gray-300 hover:bg-[#2D2D35] px-3 py-1.5 text-sm rounded-sm flex items-center">
              Age
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="bg-[#1F1F23] text-gray-300 hover:bg-[#2D2D35] px-3 py-1.5 text-sm rounded-sm flex items-center">
              Ethnicity
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="bg-[#1F1F23] text-gray-300 hover:bg-[#2D2D35] px-3 py-1.5 text-sm rounded-sm flex items-center">
              Features
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="bg-[#1F1F23] text-gray-300 hover:bg-[#2D2D35] px-3 py-1.5 text-sm rounded-sm flex items-center">
              Fetishes
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="bg-[#1F1F23] text-gray-300 hover:bg-[#2D2D35] px-3 py-1.5 text-sm rounded-sm flex items-center">
              Language
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      
      {/* Adult content warning at bottom */}
      {!isLoggedIn && (
        <div className="bg-black/80 text-white text-center p-3 fixed bottom-0 left-0 right-0">
          <div className="text-lg font-bold mb-1">Adult Content Warning</div>
          <p className="text-sm mb-2">Sexually Explicit Material • You Must Be 18+</p>
          <div className="flex justify-center gap-2 text-xs text-gray-400">
            <span>By using this site, I accept the</span>
            <a href="/terms" className="underline">Cookie Policy</a>
            <span>•</span>
            <a href="/privacy" className="underline">Privacy</a>
            <span>•</span>
            <a href="/terms" className="underline">Terms and Conditions</a>
            <span>•</span>
            <a href="/tos" className="underline">2257</a>
          </div>
        </div>
      )}
    </div>
  );
}
