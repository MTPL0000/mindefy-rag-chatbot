"use client";

import { Film, MessageSquare, Sparkles } from 'lucide-react';
import ProjectCard from '@/features/shared/components/ProjectCard';
import Image from 'next/image';

export default function HomePage() {
  const projects = [
    {
      title: 'CineSense',
      description: 'Discover your next favorite movie with AI-powered recommendations. Select movies you love and get personalized suggestions tailored to your taste.',
      icon: Film,
      href: 'https://movie-recommendation.mindefy.tech',
      gradient: 'bg-gradient-to-br from-[#332771] to-[#5b4a9f]',
      iconColor: 'text-[#332771]',
      image: true,
    },
    {
      title: 'AskDocs',
      description: 'Chat with your documents using advanced RAG technology. Upload PDFs, ask questions, and get intelligent answers powered by AI.',
      icon: MessageSquare,
      href: 'https://ask.mindefy.tech',
      gradient: 'bg-gradient-to-br from-[#332771] to-[#d93311]',
      iconColor: 'text-[#332771]',
      image: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0e8] via-[#fdfbf7] to-[#ede5db]" style={{
      '--background': '#ffffff',
      '--foreground': '#171717',
      '--card': '#ffffff',
      '--card-hover': '#f9fafb',
      '--border': '#e5e7eb',
      '--muted': '#6b7280',
      '--muted-foreground': '#6b7280',
      '--accent': '#7c3aed',
      '--accent-hover': '#6d28d9'
    }}>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 py-2">
              <Image 
                src="/logo.svg" 
                alt="Mindefy Logo" 
                width={64} 
                height={64}
                className=""
              />
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-[#332771] via-[#5b4a9f] to-[#d93311] bg-clip-text text-transparent leading-tight pb-1">
                Mindefy Portfolio
              </h1>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-gray-900 leading-tight">
              Choose Your Experience
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Explore our AI-powered applications designed to enhance your productivity and entertainment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">
            {projects.map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                description={project.description}
                icon={project.icon}
                href={project.href}
                gradient={project.gradient}
                iconColor={project.iconColor}
                image={project.image}
              />
            ))}
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#332771]/5 via-white to-[#d93311]/5 border border-[#332771]/20 shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#332771]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#d93311]/10 rounded-full blur-3xl"></div>
            
            <div className="relative p-8 sm:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-[#332771] to-[#d93311] bg-clip-text text-transparent">
                  Powered by Advanced AI
                </h3>
                <p className="text-muted text-base max-w-2xl mx-auto">
                  Experience the future of productivity and entertainment with our cutting-edge AI applications
                </p>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[#332771]/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#332771] to-[#5b4a9f] flex items-center justify-center mb-4">
                    <Film className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Smart Recommendations</h4>
                  <p className="text-sm text-muted">AI-powered movie suggestions tailored to your unique taste</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[#332771]/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#332771] to-[#d93311] flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Document Intelligence</h4>
                  <p className="text-sm text-muted">Chat with your PDFs using advanced RAG technology</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[#332771]/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#5b4a9f] to-[#d93311] flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Seamless Experience</h4>
                  <p className="text-sm text-muted">Intuitive interfaces designed for maximum productivity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-muted">
            © 2026 Mindefy. Powered by AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
