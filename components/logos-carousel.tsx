"use client";

import { CreditCard, QrCode } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Integration =
  | { name: string; kind: "brand"; src: string }
  | { name: string; kind: "icon"; Icon: LucideIcon };

// Real integrations used by the platform. Brand marks from theSVG.org (mono),
// concepts without a brand mark use consistent lucide line icons.
const INTEGRATIONS: Integration[] = [
  { name: "WhatsApp", kind: "brand", src: "/brands/whatsapp.svg" },
  { name: "Webpay", kind: "icon", Icon: CreditCard },
  { name: "QR Check-in", kind: "icon", Icon: QrCode },
  { name: "Booking.com", kind: "brand", src: "/brands/bookingdotcom.svg" },
  { name: "Airbnb", kind: "brand", src: "/brands/airbnb.svg" },
  { name: "Expedia", kind: "brand", src: "/brands/expedia.svg" },
  { name: "Mercado Pago", kind: "brand", src: "/brands/mercado-pago.svg" },
];

function IntegrationMark({ item }: { item: Integration }) {
  return (
    <div className="flex flex-shrink-0 items-center gap-2.5 px-6 text-foreground/45 transition-colors duration-300 hover:text-primary">
      {item.kind === "brand" ? (
        <span
          aria-hidden
          className="block h-6 w-6"
          style={{
            backgroundColor: "currentColor",
            WebkitMaskImage: `url(${item.src})`,
            maskImage: `url(${item.src})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskSize: "contain",
            maskSize: "contain",
          }}
        />
      ) : (
        <item.Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
      )}
      <span className="whitespace-nowrap text-sm font-medium tracking-tight">{item.name}</span>
    </div>
  );
}

export function LogosCarousel() {
  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...INTEGRATIONS, ...INTEGRATIONS];

  return (
    <div className="relative w-full overflow-hidden py-6">
      {/* Edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent" />

      <div className="flex w-max animate-marquee items-center">
        {loop.map((item, i) => (
          <IntegrationMark key={`${item.name}-${i}`} item={item} />
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
