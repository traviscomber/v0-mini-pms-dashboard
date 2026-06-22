'use client';

import { Star } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  result: string;
  image: string;
  rating: number;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  title: string;
  subtitle: string;
}

export function TestimonialsSection({
  testimonials,
  title,
  subtitle,
}: TestimonialsSectionProps) {
  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-xl border border-primary/30 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur p-6 md:p-8 hover:border-primary/60 hover:bg-gradient-to-br hover:from-card hover:to-card/80 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-base md:text-lg mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Result */}
              <div className="bg-primary/10 rounded-lg p-3 mb-6 border border-primary/20">
                <p className="text-sm font-semibold text-primary">
                  {testimonial.result}
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role} @ {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
