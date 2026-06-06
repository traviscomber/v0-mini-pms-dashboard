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
      selectRoom: 'Select Room',
      available: 'Available',
      full: 'Full',
      nights: 'nights',
      showing: 'Showing',
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
      roomManagement: 'Room Management',
      rooms: 'Rooms',
      capacity: 'Capacity',
      nightly: 'Nightly Rate',
      basePrice: 'Base Price',
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
      lowOccupancy: 'Low Occupancy',
      occupancy: 'Current occupancy is',
      consider: 'Consider promotions.',
      pendingPayments: 'Pending Payments',
      pending: 'Pending payment(s).',
      checkinsTitle: 'Check-ins Today',
      checkInsToday: 'Check-ins today. Prepare rooms.',
    },
    // Charts & Reports
    reports: {
      bookingStatus: 'Booking Status',
      confirmed: 'Confirmed',
      pending: 'Pending',
      completed: 'Completed',
      keyMetrics: 'Key Metrics',
      avgRevenue: 'Avg Revenue',
      avgOccupancy: 'Avg Occupancy',
      totalBookings: 'Total Bookings',
      avgPriceNight: 'Avg Price/Night',
    },
    // Property Management
    property: {
      roomManagement: 'Room Management',
      bulkRates: 'Bulk Rate Manager',
      cleaning: 'Cleaning Schedule',
      forecast: 'Occupancy Forecast',
    },
    // Sidebar & Settings
    sidebar: {
      proTip: 'Pro Tip',
      toggleLanguageTheme: 'Toggle language & theme above',
      light: 'Light',
      dark: 'Dark',
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
      selectRoom: 'Seleccionar Habitación',
      available: 'Disponible',
      full: 'Lleno',
      nights: 'noches',
      showing: 'Mostrando',
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
      roomManagement: 'Gestión de Habitaciones',
      rooms: 'Habitaciones',
      capacity: 'Capacidad',
      nightly: 'Tarifa Noche',
      basePrice: 'Precio Base',
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
      lowOccupancy: 'Ocupación Baja',
      occupancy: 'La ocupación actual es',
      consider: 'Considera promociones.',
      pendingPayments: 'Pagos Pendientes',
      pending: 'Pagos pendientes.',
      checkinsTitle: 'Check-ins Hoy',
      checkInsToday: 'Check-ins hoy. Prepara las habitaciones.',
    },
    // Gráficos y Reportes
    reports: {
      bookingStatus: 'Estado de Reservas',
      confirmed: 'Confirmado',
      pending: 'Pendiente',
      completed: 'Completado',
      keyMetrics: 'Métricas Clave',
      avgRevenue: 'Ingresos Promedio',
      avgOccupancy: 'Ocupación Promedio',
      totalBookings: 'Total de Reservas',
      avgPriceNight: 'Precio Promedio/Noche',
    },
    // Gestión de Propiedades
    property: {
      roomManagement: 'Gestión de Habitaciones',
      bulkRates: 'Gestor de Tarifas en Lote',
      cleaning: 'Horario de Limpieza',
      forecast: 'Pronóstico de Ocupación',
    },
    // Sidebar & Configuración
    sidebar: {
      proTip: 'Consejo Pro',
      toggleLanguageTheme: 'Alterna idioma y tema arriba',
      light: 'Claro',
      dark: 'Oscuro',
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
