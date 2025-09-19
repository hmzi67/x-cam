'use client'; // Marked as client component for interactivity

import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'white' }} /></InputAdornment>,
        }}
        sx={{ flexGrow: 1, bgcolor: '#1976d2', borderRadius: 1, input: { color: 'white' } }}
      />
    </form>
  );
}