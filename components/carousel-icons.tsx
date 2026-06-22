"use client";

import { useState, useEffect } from "react";
import { BedDouble, TrendingUp, BarChart3, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  occupancy: BedDouble,
  rate: TrendingUp,
  analytics: BarChart3,
  automation: CheckCircle2,
};

interface CarouselIconsProps {
  icons: Array<{ key: string; label: string }>;
  autoplay?: boolean;
  interval?: number;
}

export function CarouselIcons({ icons, autoplay = true, interval = 4000 }: CarouselIconsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % icons.length);
    }, interval);
    return () => clearInterval(timer);
  }, [icons.length, autoplay, interval]);

  const goToPrevious = () => setActiveIndex((prev) => (prev - 1 + icons.length) % icons.length);
  const goToNext = () => setActiveIndex((prev) => (prev + 1) % icons.length);

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/40 px-12 py-10">
        {/* Slides */}
        <div className="relative flex h-28 items-center justify-center">
          {icons.map((item, idx) => {
            const Icon = ICONS[item.key] ?? CheckCircle2;
            return (
              <div
                key={idx}
                className={`absolute inset-0 flex flex-col items-center justify-center gap-4 text-center transition-all duration-500 ${
                  idx === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                style={{ pointerEvents: idx === activeIndex ? "auto" : "none" }}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                </span>
                <p className="max-w-xs text-sm font-medium text-foreground/70">{item.label}</p>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <button
          onClick={goToPrevious}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-primary/10 p-2 text-primary transition hover:bg-primary/20"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-primary/10 p-2 text-primary transition hover:bg-primary/20"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {icons.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all ${idx === activeIndex ? "w-8 bg-primary" : "w-2 bg-primary/30"}`}
              aria-label={`Ir al slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
