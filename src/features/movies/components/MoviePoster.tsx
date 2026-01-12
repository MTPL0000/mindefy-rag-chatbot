interface MoviePosterProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
}

export default function MoviePoster({ src, alt, className = '' }: MoviePosterProps) {
  if (!src || src === 'null' || src === '') {
    return (
      <div className={`flex items-center justify-center bg-muted/20 border border-border/50 ${className}`}>
        <span className="text-muted-foreground text-sm font-medium">N/A</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = '<div class="flex items-center justify-center bg-card/50 border border-border/30 h-full w-full"><span class="text-muted text-sm font-medium">N/A</span></div>';
        }
      }}
    />
  );
}
