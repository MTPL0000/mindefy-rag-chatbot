'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProjectCard({ title, description, icon: Icon, href, gradient, iconColor, image }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2 flex flex-col h-full"
    >
      {/* Image Section */}
      {image && (
        <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <div className={`absolute inset-0 ${gradient} opacity-10 group-hover:opacity-15 transition-opacity duration-500`} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className={`w-24 h-24 ${iconColor} opacity-15`} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`p-5 rounded-3xl bg-white shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500`}>
              <Icon className={`w-14 h-14 ${iconColor}`} />
            </div>
          </div>
        </div>
      )}
      
      {/* Content Section */}
      <div className="relative p-8 flex-1 flex flex-col bg-white">
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${gradient} rounded-b-2xl`} />
        
        <h3 className="text-2xl font-bold mb-3 text-gray-900 relative z-10 group-hover:text-[#332771] transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-base text-gray-600 mb-6 leading-relaxed flex-1 relative z-10">
          {description}
        </p>

        <div className={`flex items-center gap-2 ${iconColor} font-semibold transition-all duration-300 group-hover:gap-3 relative z-10 text-base`}>
          <span>Explore Project</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </div>
    </div>
  );
}
