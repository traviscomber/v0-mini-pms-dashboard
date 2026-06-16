"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface LogoItem {
  name: string;
  path: string;
  color: string;
}

export function LogosCarousel({ logos }: { logos: LogoItem[] }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Duplicate logos for infinite scroll effect
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <div className="w-full overflow-hidden py-12 md:py-16">
      <div className="relative">
        {/* Gradient overlays */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-background to-transparent" />

        {/* Carousel container */}
        <div
          className={`flex gap-8 md:gap-12 transition-transform duration-1000 ease-linear ${
            isVisible ? "animate-scroll" : ""
          }`}
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex-shrink-0 h-16 w-32 flex items-center justify-center rounded-lg border border-primary/10 bg-primary/5 backdrop-blur-sm hover:bg-primary/10 transition-colors duration-300"
              style={{ borderColor: `${logo.color}20` }}
            >
              <div className="relative w-24 h-12">
                <Image
                  src={logo.path}
                  alt={logo.name}
                  fill
                  className="object-contain"
                  priority={index < logos.length}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${logos.length * 260}px);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
