"use client";

import { Copy, MessagesSquare, Send } from "lucide-react";
import { useMemo, useState } from "react";

import type { Reservation } from "../types";

interface SmartMessageBoardProps {
  reservations: Reservation[];
  onNavigate: () => void;
}

type Draft = {
  id: string;
  label: string;
  guestName: string;
  subject: string;
  body: string;
  tone: "warm" | "direct" | "recovery";
};

function toDate(value: unknown) {
  if (!value) return new Date(0);
  return value instanceof Date ? value : new Date(value as string);
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function SmartMessageBoard({ reservations, onNavigate }: SmartMessageBoardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const drafts = useMemo<Draft[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const arrivingSoon = reservations
      .filter((reservation) => {
        const status = String(reservation.reservationStatus ?? reservation.status ?? "").toLowerCase();
        const checkIn = toDate(reservation.checkInDate ?? reservation.checkIn ?? reservation.check_in_date);
        return status !== "cancelled" && checkIn >= today && checkIn <= tomorrow;
      })
      .slice(0, 1);

    const overdue = reservations
      .filter((reservation) => Number(reservation.balanceDue ?? 0) > 0)
      .slice(0, 1);

    const stayGuests = reservations
      .filter((reservation) => {
        const checkIn = toDate(reservation.checkInDate ?? reservation.checkIn ?? reservation.check_in_date);
        const checkOut = toDate(reservation.checkOutDate ?? reservation.checkOut ?? reservation.check_out_date);
        return checkIn <= today && checkOut > today;
      })
      .slice(0, 1);

    return [
      arrivingSoon[0]
        ? {
            id: `arrive-${arrivingSoon[0].id}`,
            label: "Pre-arrival welcome",
            guestName: arrivingSoon[0].guestName,
            subject: `Welcome to your stay, ${arrivingSoon[0].guestName}`,
            body: `Hi ${arrivingSoon[0].guestName},\n\nWe are looking forward to hosting you. Your check-in is scheduled for ${formatShortDate(
              toDate(arrivingSoon[0].checkInDate ?? arrivingSoon[0].checkIn ?? arrivingSoon[0].check_in_date),
            )}.\n\nIf you'd like anything prepared in advance, just reply here and we'll take care of it.\n\n— The team`,
            tone: "warm",
          }
        : {
            id: "arrive-demo",
            label: "Pre-arrival welcome",
            guestName: "Next guest",
            subject: "Welcome to your stay",
            body: "Hi there,\n\nWe are looking forward to hosting you. If you'd like anything prepared in advance, just reply here and we'll take care of it.\n\n— The team",
            tone: "warm",
          },
      overdue[0]
        ? {
            id: `payment-${overdue[0].id}`,
            label: "Payment reminder",
            guestName: overdue[0].guestName,
            subject: `Balance reminder for ${overdue[0].guestName}`,
            body: `Hi ${overdue[0].guestName},\n\nA balance of $${overdue[0].balanceDue.toFixed(2)} remains on your reservation. If you've already settled it, please ignore this note.\n\nIf you'd like us to help, we can send a secure payment link right away.\n\n— The team`,
            tone: "direct",
          }
        : {
            id: "payment-demo",
            label: "Payment reminder",
            guestName: "Guest",
            subject: "Balance reminder",
            body: "Hi,\n\nA balance remains on your reservation. If you'd like us to help, we can send a secure payment link right away.\n\n— The team",
            tone: "direct",
          },
      stayGuests[0]
        ? {
            id: `review-${stayGuests[0].id}`,
            label: "In-stay check-in",
            guestName: stayGuests[0].guestName,
            subject: `Quick check-in, ${stayGuests[0].guestName}`,
            body: `Hi ${stayGuests[0].guestName},\n\nJust checking that everything is going smoothly with your stay. If anything would make it better, reply here and we'll jump on it.\n\n— The team`,
            tone: "recovery",
          }
        : {
            id: "review-demo",
            label: "In-stay check-in",
            guestName: "Current guest",
            subject: "Quick check-in",
            body: "Hi,\n\nJust checking that everything is going smoothly with your stay. If anything would make it better, reply here and we'll jump on it.\n\n— The team",
            tone: "recovery",
          },
    ];
  }, [reservations]);

  const copyDraft = async (draft: Draft) => {
    await navigator.clipboard.writeText(`${draft.subject}\n\n${draft.body}`);
    setCopiedId(draft.id);
    window.setTimeout(() => setCopiedId((current) => (current === draft.id ? null : current)), 2000);
  };

  return (
    <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Message copilot</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Drafts ready to send in seconds.</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/65">
            Use the day's reservation context to prepare guest communication without starting from a blank page.
          </p>
        </div>
        <button
          type="button"
          onClick={onNavigate}
          className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/25 hover:bg-primary/5"
        >
          <Send className="h-4 w-4 text-primary" />
          Open messaging
        </button>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {drafts.map((draft) => (
          <article key={draft.id} className="rounded-3xl border border-border bg-background/70 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{draft.label}</p>
                <h4 className="mt-1 text-base font-semibold text-foreground">{draft.guestName}</h4>
              </div>
              <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-foreground/60">{draft.tone}</span>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-card/80 p-4">
              <p className="text-sm font-medium text-foreground">{draft.subject}</p>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-foreground/70">{draft.body}</p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => void copyDraft(draft)}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
              >
                <Copy className="h-4 w-4" />
                {copiedId === draft.id ? "Copied" : "Copy draft"}
              </button>
              <button
                type="button"
                onClick={onNavigate}
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/25 hover:bg-primary/5"
              >
                <MessagesSquare className="h-4 w-4" />
                Send
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
