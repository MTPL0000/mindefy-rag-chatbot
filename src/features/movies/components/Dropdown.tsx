'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
}

export default function Dropdown({ value, onChange, options, placeholder, className = '' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2.5 rounded-lg bg-card border border-border/30 px-3.5 py-2 text-sm font-medium outline-none transition-all hover:border-border focus:border-accent focus:ring-1 focus:ring-accent/20 shadow-sm cursor-pointer"
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDown 
          className={`h-4 w-4 text-muted transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-lg bg-card border border-border/50 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[260px] overflow-y-auto py-1 scrollbar-thin">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-2 text-sm transition-colors ${
                  option.value === value
                    ? 'bg-accent/10 text-accent font-medium'
                    : 'text-foreground hover:bg-muted/10'
                }`}
              >
                <span className="truncate">{option.label}</span>
                {option.value === value && (
                  <Check className="h-3.5 w-3.5 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
