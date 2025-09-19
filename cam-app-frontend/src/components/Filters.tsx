'use client';
import { Box, Select, MenuItem, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

export default function Filters({ region, age, ethnicity, fetish, language, onFilterChange }: { region: string; age: string; ethnicity: string; fetish: string; language: string; onFilterChange: (key: string, value: string) => void }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center', gap: 1 }}>
      <Select value={region} onChange={(e) => onFilterChange('region', e.target.value as string)} displayEmpty sx={{ minWidth: 120, bgcolor: '#1976d2', color: 'white', '& .MuiSelect-icon': { color: 'white' } }}>
        <MenuItem value="">Regions</MenuItem>
        <MenuItem value="US/CA/UK/Australia">US/CA/UK/Australia</MenuItem>
        <MenuItem value="Western Europe">Western Europe</MenuItem>
      </Select>
      <Select value={age} onChange={(e) => onFilterChange('age', e.target.value as string)} displayEmpty sx={{ minWidth: 120, bgcolor: '#1976d2', color: 'white', '& .MuiSelect-icon': { color: 'white' } }}>
        <MenuItem value="">Age</MenuItem>
        <MenuItem value="Teen 18+">Teen 18+</MenuItem>
        <MenuItem value="20s">20s</MenuItem>
      </Select>
      <Select value={ethnicity} onChange={(e) => onFilterChange('ethnicity', e.target.value as string)} displayEmpty sx={{ minWidth: 120, bgcolor: '#1976d2', color: 'white', '& .MuiSelect-icon': { color: 'white' } }}>
        <MenuItem value="">Ethnicity</MenuItem>
        <MenuItem value="Asian">Asian</MenuItem>
        <MenuItem value="Black">Black</MenuItem>
      </Select>
      <Select value={fetish} onChange={(e) => onFilterChange('fetish', e.target.value as string)} displayEmpty sx={{ minWidth: 120, bgcolor: '#1976d2', color: 'white', '& .MuiSelect-icon': { color: 'white' } }}>
        <MenuItem value="">Fetishes</MenuItem>
        <MenuItem value="Anal">Anal</MenuItem>
        <MenuItem value="BDSM">BDSM</MenuItem>
      </Select>
      <Select value={language} onChange={(e) => onFilterChange('language', e.target.value as string)} displayEmpty sx={{ minWidth: 120, bgcolor: '#1976d2', color: 'white', '& .MuiSelect-icon': { color: 'white' } }}>
        <MenuItem value="">Languages</MenuItem>
        <MenuItem value="Deutsch">Deutsch</MenuItem>
        <MenuItem value="English">English</MenuItem>
      </Select>
      <Button variant="outlined" sx={{ color: 'white', borderColor: 'white' }}>
        <RefreshIcon sx={{ mr: 1 }} /> Refresh
      </Button>
    </Box>
  );
}