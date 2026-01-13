'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function DashboardHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/95 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <Image 
            src="/favicon.png" 
            alt="Mindefy Logo" 
            width={40} 
            height={40}
            className="rounded-xl"
          />
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#332771] via-[#5b4a9f] to-[#d93311] bg-clip-text text-transparent">
            Mindefy Portfolio
          </h1>
        </div>
      </div>
    </header>
  );
}
