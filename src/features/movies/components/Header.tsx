'use client';

import { Film } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/movies');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
            <Film className="h-5 w-5 text-accent" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">CineSense</h1>
        </div>
      </div>
    </header>
  );
}
