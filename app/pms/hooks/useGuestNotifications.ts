'use client';

import { useEffect, useState } from 'react';

/**
 * Hook para notificaciones a guests
 * Genera notificaciones basadas en eventos de reserva:
 * - Confirmación de reserva
 * - Reminder 48h antes check-in
 * - Check-in instructions
 * - Review request después checkout
 */
export function useGuestNotifications(reservations: any[] = [], tasks: any[] = []) {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const notifications = generateGuestNotifications(reservations, tasks);
    setNotifications(notifications);

    // Re-check cada 60 minutos
    const interval = setInterval(() => {
      const updated = generateGuestNotifications(reservations, tasks);
      setNotifications(updated);
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [reservations, tasks]);

  return {
    notifications,
    totalPending: notifications.filter(n => !n.sent).length,
    sendNotification: (id: string) => sendGuestNotification(id),
    markAsSent: (id: string) => {
      setNotifications(n => n.map(notif => (notif.id === id ? { ...notif, sent: true } : notif)));
    },
  };
}

/**
 * Genera todas las notificaciones que debería recibir un guest
 */
function generateGuestNotifications(reservations: any[] = [], tasks: any[] = []) {
  const notifications: any[] = [];
  const now = new Date();
  const guestsSeen = new Set<string>();

  reservations.forEach(reservation => {
    if (guestsSeen.has(reservation.guestId)) return;
    guestsSeen.add(reservation.guestId);

    const guestName = reservation.guestName || 'Guest';
    const guestEmail = reservation.guestEmail || 'guest@example.com';
    const checkIn = new Date(reservation.checkInDate);
    const checkOut = new Date(reservation.checkOutDate);
    const hoursUntilCheckIn = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60);
    const hoursAfterCheckOut = (now.getTime() - checkOut.getTime()) / (1000 * 60 * 60);

    // 1. Confirmación de reserva (24h después de crear)
    const createdAt = new Date(reservation.createdAt || now);
    const hoursSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceCreated < 24 && !hasNotification(notifications, 'confirmation', reservation.id)) {
      notifications.push({
        id: `${reservation.id}-confirmation`,
        type: 'confirmation',
        reservationId: reservation.id,
        guestName,
        guestEmail,
        subject: `✅ Reserva Confirmada - ${reservation.id}`,
        message: `¡Hola ${guestName}! Tu reserva del ${checkIn.toLocaleDateString()} al ${checkOut.toLocaleDateString()} ha sido confirmada.`,
        template: 'CONFIRMATION',
        sent: false,
        sendAt: new Date(),
        priority: 1,
      });
    }

    // 2. Reminder 48h antes del check-in
    if (hoursUntilCheckIn > 0 && hoursUntilCheckIn < 48 && !hasNotification(notifications, 'reminder_48h', reservation.id)) {
      notifications.push({
        id: `${reservation.id}-reminder-48h`,
        type: 'reminder_48h',
        reservationId: reservation.id,
        guestName,
        guestEmail,
        subject: `📢 Tu check-in es mañana a las ${reservation.checkInTime || '15:00'}`,
        message: `¡Hola ${guestName}! Te recordamos que tu check-in es en 48 horas. Prepárate para una excelente experiencia.`,
        template: 'REMINDER_48H',
        sent: false,
        sendAt: new Date(),
        priority: 2,
      });
    }

    // 3. Instrucciones de check-in (24h antes)
    if (hoursUntilCheckIn > 0 && hoursUntilCheckIn < 24 && !hasNotification(notifications, 'checkin_instructions', reservation.id)) {
      notifications.push({
        id: `${reservation.id}-checkin-instructions`,
        type: 'checkin_instructions',
        reservationId: reservation.id,
        guestName,
        guestEmail,
        subject: `🔑 Instrucciones de Check-in`,
        message: `${guestName}, aquí están tus instrucciones:\n- Código de acceso: 1234\n- Check-in: 15:00\n- WiFi: HotelNet / password123`,
        template: 'CHECKIN_INSTRUCTIONS',
        sent: false,
        sendAt: new Date(checkIn.getTime() - 2 * 60 * 60 * 1000), // 2h antes
        priority: 3,
      });
    }

    // 4. Solicitud de review (12h después checkout)
    if (hoursAfterCheckOut > 0 && hoursAfterCheckOut < 12 && !hasNotification(notifications, 'review_request', reservation.id)) {
      notifications.push({
        id: `${reservation.id}-review-request`,
        type: 'review_request',
        reservationId: reservation.id,
        guestName,
        guestEmail,
        subject: `⭐ ¿Cómo fue tu estancia?`,
        message: `${guestName}, nos encantaría saber tu opinión sobre tu estadía. ¡Deja una reseña!`,
        template: 'REVIEW_REQUEST',
        sent: false,
        sendAt: new Date(),
        priority: 0,
      });
    }

    // 5. Alerta de pago pendiente (si aplica)
    if (reservation.paymentStatus === 'pending' && !hasNotification(notifications, 'payment_reminder', reservation.id)) {
      notifications.push({
        id: `${reservation.id}-payment-reminder`,
        type: 'payment_reminder',
        reservationId: reservation.id,
        guestName,
        guestEmail,
        subject: `💳 Pago Pendiente - ${reservation.amount}`,
        message: `${guestName}, aún falta completar el pago de $${reservation.amount}. Reserva segura garantizada.`,
        template: 'PAYMENT_REMINDER',
        sent: false,
        sendAt: new Date(),
        priority: 2,
      });
    }
  });

  // Sort by priority and sendAt date
  return notifications.sort((a, b) => {
    const priorityDiff = b.priority - a.priority;
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.sendAt).getTime() - new Date(b.sendAt).getTime();
  });
}

/**
 * Check if notification already exists
 */
function hasNotification(notifications: any[], type: string, reservationId: string): boolean {
  return notifications.some(n => n.type === type && n.reservationId === reservationId);
}

/**
 * Simula enviar notificación a guest
 * En producción: integrar con SendGrid, Twilio, Firebase, etc
 */
async function sendGuestNotification(notificationId: string) {
  try {
    // En producción, aquí iría:
    // await sendEmail(notification.guestEmail, notification.subject, notification.message);
    // await sendSMS(notification.guestPhone, notification.message);
    // await sendPushNotification(notification.guestId, notification.message);

    // Por ahora, simular con localStorage
    const sent = JSON.parse(localStorage.getItem('sent_notifications') || '[]');
    sent.push({ id: notificationId, sentAt: new Date().toISOString() });
    localStorage.setItem('sent_notifications', JSON.stringify(sent));

    console.log(`[v0] Notificación enviada: ${notificationId}`);
    return true;
  } catch (error) {
    console.error('[v0] Error enviando notificación:', error);
    return false;
  }
}

/**
 * Templates de notificación (para futuro: usar en email/SMS)
 */
export const NOTIFICATION_TEMPLATES = {
  CONFIRMATION: {
    subject: '✅ Reserva Confirmada',
    icon: '✅',
  },
  REMINDER_48H: {
    subject: '📢 Reminder: Check-in en 48h',
    icon: '📢',
  },
  CHECKIN_INSTRUCTIONS: {
    subject: '🔑 Instrucciones de Check-in',
    icon: '🔑',
  },
  REVIEW_REQUEST: {
    subject: '⭐ Deja tu Reseña',
    icon: '⭐',
  },
  PAYMENT_REMINDER: {
    subject: '💳 Pago Pendiente',
    icon: '💳',
  },
};
