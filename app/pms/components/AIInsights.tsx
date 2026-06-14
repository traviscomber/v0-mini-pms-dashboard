"use client";

import { useMemo } from "react";
import { BadgeDollarSign, Brain, ShieldAlert, TrendingUp, Users } from "lucide-react";

import { useLanguage as useLanguage } from "../LanguageContext";
import type { Reservation, Room } from "../types";

interface AIInsightsProps {
  rooms: Room[];
  reservations: Reservation[];
}

function toDate(value: unknown) {
  if (!value) return new Date(0);
  return value instanceof Date ? value : new Date(value as string);
}

export default function AIInsights({ rooms, reservations }: AIInsightsProps) {
  const { language } = useLanguage();

  const insights = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeReservations = reservations.filter((reservation) => {
      const status = String(reservation.reservationStatus ?? reservation.status ?? "").toLowerCase();
      const checkInDate = toDate(reservation.checkInDate ?? reservation.checkIn ?? reservation.check_in_date);
      const checkOutDate = toDate(reservation.checkOutDate ?? reservation.checkOut ?? reservation.check_out_date);
      return status !== "cancelled" && checkInDate <= today && checkOutDate > today;
    });

    const arrivingToday = reservations.filter((reservation) => {
      const checkInDate = toDate(reservation.checkInDate ?? reservation.checkIn ?? reservation.check_in_date);
      return checkInDate.toDateString() === today.toDateString();
    });

    const pendingPayments = reservations.filter((reservation) => {
      const balanceDue = Number(reservation.balanceDue ?? 0);
      const status = String(reservation.paymentStatus ?? "").toLowerCase();
      return balanceDue > 0 && status !== "paid";
    });

    const highValueReservations = reservations.filter((reservation) => Number(reservation.totalAmount ?? 0) >= 250);
    const roomCoverage = rooms.length > 0 ? Math.round((activeReservations.length / rooms.length) * 100) : 0;
    const paymentRisk = reservations.length > 0 ? Math.round((pendingPayments.length / reservations.length) * 100) : 0;
    const guestDiversity = new Set(reservations.map((reservation) => reservation.guestName)).size;
    const forecastValue = reservations.reduce((sum, reservation) => sum + Number(reservation.totalAmount ?? 0), 0);

    const pricingSignal =
      roomCoverage < 70
        ? {
            label: language === "es" ? "Pricing" : "Pricing",
            title: language === "es" ? "Protege la tarifa" : "Protect the rate",
            value: `${roomCoverage}%`,
            detail:
              language === "es"
                ? "La ocupación aún tiene espacio: prioriza ADR sobre descuento."
                : "Occupancy still has room: protect ADR before discounting.",
            tone: "emerald",
            icon: BadgeDollarSign,
          }
        : {
            label: language === "es" ? "Pricing" : "Pricing",
            title: language === "es" ? "Defiende la demanda" : "Defend demand",
            value: `${roomCoverage}%`,
            detail:
              language === "es"
                ? "La casa ya está apretada; evita recortar precio demasiado pronto."
                : "The house is tightening; avoid cutting price too early.",
            tone: "cyan",
            icon: BadgeDollarSign,
          };

    const cancellationSignal =
      paymentRisk > 35
        ? {
            label: language === "es" ? "Riesgo" : "Risk",
            title: language === "es" ? "Atención con cobros" : "Watch collections",
            value: `${paymentRisk}%`,
            detail:
              language === "es"
                ? `${pendingPayments.length} reserva${pendingPayments.length === 1 ? "" : "s"} con saldo pendiente.`
                : `${pendingPayments.length} reservation${pendingPayments.length === 1 ? "" : "s"} have an open balance.`,
            tone: "rose",
            icon: ShieldAlert,
          }
        : {
            label: language === "es" ? "Riesgo" : "Risk",
            title: language === "es" ? "Cobros controlados" : "Collections stable",
            value: `${paymentRisk}%`,
            detail:
              language === "es"
                ? "No se ve fricción importante en el cierre financiero inmediato."
                : "No major friction appears in the near-term financial close.",
            tone: "slate",
            icon: ShieldAlert,
          };

    const forecastSignal = {
      label: language === "es" ? "Forecast" : "Forecast",
      title: language === "es" ? "Pulso de ingresos" : "Revenue pulse",
      value: `$${Math.round(forecastValue).toLocaleString()}`,
      detail:
        language === "es"
          ? `${arrivingToday.length} llegada${arrivingToday.length === 1 ? "" : "s"} hoy y ${highValueReservations.length} reserva${highValueReservations.length === 1 ? "" : "s"} de alto valor.`
          : `${arrivingToday.length} arrival${arrivingToday.length === 1 ? "" : "s"} today and ${highValueReservations.length} high-value booking${highValueReservations.length === 1 ? "" : "s"}.`,
      tone: "violet",
      icon: TrendingUp,
    };

    const guestSignal = {
      label: language === "es" ? "Guest mix" : "Guest mix",
      title: language === "es" ? "Base activa" : "Active base",
      value: `${guestDiversity}`,
      detail:
        language === "es"
          ? "Úsalo para personalizar mensajes, upsell y recuperación de servicio."
          : "Use it to personalize messages, upsells, and service recovery.",
      tone: "amber",
      icon: Users,
    };

    return {
      pricingSignal,
      cancellationSignal,
      forecastSignal,
      guestSignal,
    };
  }, [language, reservations, rooms]);

  const cards = [
    insights.pricingSignal,
    insights.cancellationSignal,
    insights.forecastSignal,
    insights.guestSignal,
  ];

  return (
    <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {language === "es" ? "Capa de IA" : "AI layer"}
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {language === "es" ? "Qué está viendo el sistema ahora." : "What the system sees right now."}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/65">
            {language === "es"
              ? "Una lectura breve y accionable para que el equipo no tenga que interpretar tablas."
              : "A short, actionable read so the team does not need to interpret tables."}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-foreground/70">
          <Brain className="h-3.5 w-3.5 text-primary" />
          {language === "es" ? "Resumen automático" : "Automatic summary"}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const toneClasses: Record<string, string> = {
            emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-300",
            cyan: "border-cyan-500/20 bg-cyan-500/5 text-cyan-300",
            rose: "border-rose-500/20 bg-rose-500/5 text-rose-300",
            violet: "border-violet-500/20 bg-violet-500/5 text-violet-300",
            amber: "border-amber-500/20 bg-amber-500/5 text-amber-300",
            slate: "border-slate-500/20 bg-slate-500/5 text-slate-300",
          };

          return (
            <article key={card.title} className={`rounded-3xl border p-5 ${toneClasses[card.tone] ?? toneClasses.slate}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-background/80 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">{card.label}</p>
                    <h4 className="text-base font-semibold text-foreground">{card.title}</h4>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-2xl font-semibold tracking-tight text-foreground">{card.value}</p>
              <p className="mt-2 text-sm leading-6 text-foreground/65">{card.detail}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-sm text-foreground/60">
        {language === "es"
          ? "La siguiente mejora ideal es conectar estas señales con acciones automáticas por rol."
          : "The next ideal step is connecting these signals to role-based automated actions."}
      </div>
    </section>
  );
}
