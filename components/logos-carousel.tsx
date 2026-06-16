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
    <div className="w-full py-12 md:py-16 bg-gradient-to-r from-background via-primary/5 to-background rounded-xl border border-primary/10">
      <div className="relative px-6 md:px-12">
        {/* Gradient overlays for seamless scroll */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />

        {/* Carousel container */}
        <div
          className={`flex gap-6 md:gap-10 transition-transform duration-1000 ease-linear ${
            isVisible ? "animate-scroll" : ""
          }`}
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex-shrink-0 h-20 w-36 flex items-center justify-center rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-md hover:border-primary/40 hover:bg-primary/15 transition-all duration-300 shadow-lg hover:shadow-primary/20"
              style={{ 
                borderColor: `${logo.color}30`,
                backgroundColor: `${logo.color}08`
              }}
            >
              <div className="relative w-28 h-14">
                <Image
                  src={logo.path}
                  alt={logo.name}
                  fill
                  className="object-contain drop-shadow-md"
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
            transform: translateX(-${logos.length * 300}px);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
