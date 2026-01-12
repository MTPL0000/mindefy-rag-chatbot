'use client';

import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, onClear, placeholder = "Search movies, genres, directors..." }: SearchBarProps) {
  const handleClear = () => {
    onChange('');
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-border bg-card px-12 py-3 text-sm outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 cursor-text"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted/10 transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X className="h-4 w-4 text-muted hover:text-foreground" />
        </button>
      )}
    </div>
  );
}
