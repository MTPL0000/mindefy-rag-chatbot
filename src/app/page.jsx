"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/rag-chatbot/store/authStore";
import { useRouter } from "next/navigation";
import { Film, MessageSquare, Sparkles } from 'lucide-react';
import ProjectCard from '@/features/shared/components/ProjectCard';
import DashboardHeader from '@/features/shared/components/DashboardHeader';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Initialize auth from localStorage
    initializeAuth();
    setIsChecking(false);
  }, [initializeAuth]);

  useEffect(() => {
    // Only redirect to login if not authenticated
    if (!isChecking && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isChecking, isAuthenticated, router]);

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderBottomColor: '#332771'}}></div>
          <p className="text-gray-800">Loading...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if authenticated
  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const projects = [
    {
      title: 'CineSense',
      description: 'Discover your next favorite movie with AI-powered recommendations. Select movies you love and get personalized suggestions tailored to your taste.',
      icon: Film,
      href: '/movies',
      gradient: 'bg-gradient-to-br from-[#332771] to-[#5b4a9f]',
      iconColor: 'text-[#332771]',
    },
    {
      title: 'AskDocs',
      description: 'Chat with your documents using advanced RAG technology. Upload PDFs, ask questions, and get intelligent answers powered by AI.',
      icon: MessageSquare,
      href: '/chat',
      gradient: 'bg-gradient-to-br from-[#332771] to-[#d93311]',
      iconColor: 'text-[#332771]',
    },
  ];

  return (
    <div className="min-h-screen bg-background" style={{
      '--background': '#ffffff',
      '--foreground': '#171717',
      '--card': '#ffffff',
      '--card-hover': '#f1f3f5',
      '--border': '#e1e4e8',
      '--muted': '#6b7280',
      '--muted-foreground': '#6b7280',
      '--accent': '#7c3aed',
      '--accent-hover': '#6d28d9'
    }}>
      <DashboardHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#332771]/10 border border-[#332771]/20 mb-6">
              <Sparkles className="w-4 h-4 text-[#332771]" />
              <span className="text-sm font-medium text-[#332771]">Welcome to MindEfy</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Choose Your Experience
            </h1>
            
            <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
              Explore our AI-powered applications designed to enhance your productivity and entertainment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {projects.map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                description={project.description}
                icon={project.icon}
                href={project.href}
                gradient={project.gradient}
                iconColor={project.iconColor}
              />
            ))}
          </div>

          <div className="bg-gradient-to-r from-[#332771]/10 via-[#332771]/5 to-[#d93311]/10 rounded-2xl p-8 border border-[#332771]/20">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Need Help?</h3>
              <p className="text-muted mb-4">
                Explore our features and discover how AI can transform your workflow
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="px-4 py-2 rounded-full bg-background border border-border">
                  🎬 Movie Recommendations
                </span>
                <span className="px-4 py-2 rounded-full bg-background border border-border">
                  📄 Document Q&A
                </span>
                <span className="px-4 py-2 rounded-full bg-background border border-border">
                  🤖 AI-Powered
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-muted">
            © 2026 MindEfy. Powered by AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
