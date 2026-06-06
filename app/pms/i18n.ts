export type Language = 'en' | 'es';

export const translations = {
  en: {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      calendar: 'Calendar',
      reservations: 'Reservations',
      properties: 'Properties',
      reports: 'Reports',
      settings: 'Settings',
    },
    // Dashboard
    dashboard: {
      title: 'Property Management Dashboard',
      subtitle: 'Manage your rental business efficiently',
      alerts: 'Alerts',
      filters: 'Filters',
      totalReservations: 'Total Reservations',
      occupancyRate: 'Occupancy Rate',
      monthlyRevenue: 'Monthly Revenue',
      lowOccupancy: 'Low Occupancy',
      pendingPayments: 'Pending Payments',
      checkinsToday: "Check-ins Today",
      checkoutsToday: "Check-outs Today",
      revenueTrend: "Revenue Trend",
      occupancyByRoom: "Occupancy by Room",
    },
    // Calendar
    calendar: {
      title: 'Booking Calendar',
      today: 'Today',
      selectDates: 'Select Dates',
      available: 'Available',
      full: 'Full',
      nights: 'nights',
    },
    // Reservations
    reservations: {
      title: 'Reservations',
      newBooking: 'New Booking',
      guest: 'Guest',
      room: 'Room',
      dates: 'Dates',
      guests: 'Guests',
      status: 'Status',
      payment: 'Payment',
      all: 'All',
      pending: 'Pending',
      confirmed: 'Confirmed',
      completed: 'Completed',
    },
    // Properties
    properties: {
      title: 'Properties',
      addRoom: 'Add Room',
      rooms: 'Rooms',
      capacity: 'Capacity',
      nightly: 'Nightly Rate',
      bulkPricing: 'Bulk Pricing',
      cleaning: 'Cleaning Schedule',
      forecast: 'Occupancy Forecast',
    },
    // Reports
    reports: {
      title: 'Reports',
      bookings: 'Bookings',
      reviews: 'Guest Reviews',
      wishlists: 'Wishlists',
      totalRevenue: 'Total Revenue',
      pendingPayments: 'Pending Payments',
      partialPayments: 'Partial Payments',
    },
    // Common
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      next: 'Next',
      back: 'Back',
      confirm: 'Confirm',
      language: 'Language',
      english: 'English',
      spanish: 'Español',
    },
    // Alerts
    alerts: {
      occupancy: 'Current occupancy is',
      consider: 'Consider promotions.',
      pending: 'Pending payment(s).',
      checkInsToday: 'Check-ins today. Prepare rooms.',
    },
  },
  es: {
    // Navegación
    nav: {
      dashboard: 'Panel de Control',
      calendar: 'Calendario',
      reservations: 'Reservaciones',
      properties: 'Propiedades',
      reports: 'Reportes',
      settings: 'Configuración',
    },
    // Panel de Control
    dashboard: {
      title: 'Panel de Gestión de Propiedades',
      subtitle: 'Gestiona tu negocio de alquiler eficientemente',
      alerts: 'Alertas',
      filters: 'Filtros',
      totalReservations: 'Total de Reservaciones',
      occupancyRate: 'Tasa de Ocupación',
      monthlyRevenue: 'Ingresos Mensuales',
      lowOccupancy: 'Ocupación Baja',
      pendingPayments: 'Pagos Pendientes',
      checkinsToday: 'Check-ins Hoy',
      checkoutsToday: 'Check-outs Hoy',
      revenueTrend: 'Tendencia de Ingresos',
      occupancyByRoom: 'Ocupación por Habitación',
    },
    // Calendario
    calendar: {
      title: 'Calendario de Reservas',
      today: 'Hoy',
      selectDates: 'Seleccionar Fechas',
      available: 'Disponible',
      full: 'Lleno',
      nights: 'noches',
    },
    // Reservaciones
    reservations: {
      title: 'Reservaciones',
      newBooking: 'Nueva Reserva',
      guest: 'Huésped',
      room: 'Habitación',
      dates: 'Fechas',
      guests: 'Huéspedes',
      status: 'Estado',
      payment: 'Pago',
      all: 'Todas',
      pending: 'Pendientes',
      confirmed: 'Confirmadas',
      completed: 'Completadas',
    },
    // Propiedades
    properties: {
      title: 'Propiedades',
      addRoom: 'Agregar Habitación',
      rooms: 'Habitaciones',
      capacity: 'Capacidad',
      nightly: 'Tarifa Noche',
      bulkPricing: 'Precios en Lote',
      cleaning: 'Horario de Limpieza',
      forecast: 'Pronóstico de Ocupación',
    },
    // Reportes
    reports: {
      title: 'Reportes',
      bookings: 'Reservas',
      reviews: 'Reseñas de Huéspedes',
      wishlists: 'Listas de Deseos',
      totalRevenue: 'Ingresos Totales',
      pendingPayments: 'Pagos Pendientes',
      partialPayments: 'Pagos Parciales',
    },
    // Común
    common: {
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      close: 'Cerrar',
      next: 'Siguiente',
      back: 'Atrás',
      confirm: 'Confirmar',
      language: 'Idioma',
      english: 'English',
      spanish: 'Español',
    },
    // Alertas
    alerts: {
      occupancy: 'La ocupación actual es',
      consider: 'Considera promociones.',
      pending: 'Pagos pendientes.',
      checkInsToday: 'Check-ins hoy. Prepara las habitaciones.',
    },
  },
};

export function t(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  for (const k of keys) {
    value = value?.[k];
  }
  return value || key;
}
