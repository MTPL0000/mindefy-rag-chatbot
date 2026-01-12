'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProjectCard({ title, description, icon: Icon, href, gradient, iconColor }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative overflow-hidden rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer hover:-translate-y-2"
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${gradient}`} />
      
      <div className="relative p-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${iconColor} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>

        <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-muted group-hover:text-white/90 mb-6 leading-relaxed transition-colors duration-300">
          {description}
        </p>

        <div className="flex items-center gap-2 text-[#332771] group-hover:text-white font-medium transition-colors duration-300">
          <span>Explore</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 bg-[#332771]/5 rounded-full blur-3xl group-hover:bg-[#332771]/20 transition-all duration-300" />
    </div>
  );
}
