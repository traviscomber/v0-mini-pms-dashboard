'use client';

import { ArrowRight, Sparkles } from 'lucide-react';

interface EnhancedCTAProps {
  primary?: string;
  secondary?: string;
  isPrimary?: boolean;
  onClick?: () => void;
  className?: string;
  withIcon?: boolean;
  withSparkle?: boolean;
}

export function EnhancedCTA({
  primary = 'Get Started',
  secondary = 'Learn More',
  isPrimary = true,
  onClick,
  className = '',
  withIcon = true,
  withSparkle = false,
}: EnhancedCTAProps) {
  if (isPrimary) {
    return (
      <button
        onClick={onClick}
        className={`relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 group overflow-hidden ${className}`}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Sparkle icon */}
        {withSparkle && (
          <Sparkles className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        )}
        
        <span className="relative z-10">{primary}</span>
        
        {withIcon && (
          <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary hover:bg-primary/10 font-semibold rounded-lg transition-all duration-300 group ${className}`}
    >
      <span>{secondary}</span>
      {withIcon && (
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
      )}
    </button>
  );
}

interface CTASectionProps {
  title: string;
  subtitle: string;
  primaryText: string;
  secondaryText: string;
  primaryAction?: () => void;
  secondaryAction?: () => void;
}

export function CTASection({
  title,
  subtitle,
  primaryText,
  secondaryText,
  primaryAction,
  secondaryAction,
}: CTASectionProps) {
  return (
    <section className="w-full py-12 md:py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl border border-primary/20">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
          {title}
        </h3>
        <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <EnhancedCTA
            primary={primaryText}
            isPrimary={true}
            onClick={primaryAction}
            withSparkle={true}
          />
          <EnhancedCTA
            secondary={secondaryText}
            isPrimary={false}
            onClick={secondaryAction}
          />
        </div>
      </div>
    </section>
  );
}
