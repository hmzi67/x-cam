'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <div className="w-full relative">
      <form 
        onSubmit={handleSearch} 
        className="flex items-center"
      >
        <div className="relative flex-grow">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full bg-[#2C2C2C] py-2 px-3 text-white placeholder-gray-400 focus:outline-none rounded-sm h-[34px]"
          />
        </div>
        <button 
          type="submit" 
          aria-label="Search"
          className="bg-[#2C2C2C] text-white px-2 ml-0 h-[34px] flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </button>
      </form>
    </div>
  );
}