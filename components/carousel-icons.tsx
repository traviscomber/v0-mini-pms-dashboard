import React, { useState, useEffect } from "react";

interface CarouselIconsProps {
  icons: Array<{ icon: string; label: string; color: string }>;
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

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev - 1 + icons.length) % icons.length);
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % icons.length);
  };

  return (
    <div className="mt-8 w-full">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-background/50 p-8">
        {/* Slides */}
        <div className="flex items-center justify-center transition-all duration-500">
          {icons.map((item, idx) => (
            <div
              key={idx}
              className={`absolute transition-all duration-500 transform ${
                idx === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{
                pointerEvents: idx === activeIndex ? "auto" : "none",
              }}
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div
                  className="text-6xl"
                  style={{ color: item.color }}
                >
                  {item.icon}
                </div>
                <p className="text-sm font-medium text-foreground/70">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-primary/10 p-2 text-primary hover:bg-primary/20 transition"
          aria-label="Previous"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-primary/10 p-2 text-primary hover:bg-primary/20 transition"
          aria-label="Next"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {icons.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === activeIndex ? "bg-primary w-8" : "bg-primary/30 w-2"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
