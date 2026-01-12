'use client';

import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/features/rag-chatbot/store/authStore';
import { useRouter } from 'next/navigation';

export default function DashboardHeader() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#332771] to-[#d93311]">
            <span className="text-xl font-bold text-white">M</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#332771]">MindEfy</h1>
            <p className="text-xs text-muted">Your AI-Powered Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
              <User className="h-4 w-4 text-[#332771]" />
              <span className="text-sm font-medium">{user.username}</span>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#332771] hover:bg-[#4a3685] text-white border border-[#332771] transition-all cursor-pointer text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
