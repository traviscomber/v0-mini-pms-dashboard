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
      reservations: 'reservations',
      unpaidBookings: 'unpaid bookings',
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
    // Tabs
    tabs: {
      all: 'All',
      pending: 'Pending',
      confirmed: 'Confirmed',
      completed: 'Completed',
      bookings: 'Bookings',
      reviews: 'Guest Reviews',
      wishlists: 'Wishlists',
    },
    // Reports
    reports: {
      title: 'Reports',
      bookingStatus: 'Booking Status',
      confirmed: 'Confirmed',
      pending: 'Pending',
      completed: 'Completed',
      keyMetrics: 'Key Metrics',
      avgRevenue: 'Total Revenue',
      avgOccupancy: 'Avg Occupancy',
      totalBookings: 'Total Bookings',
      avgPriceNight: 'Avg Price/Night',
      totalNights: 'Total Nights Booked',
      monthsOccupancy: 'months of occupancy',
      avgBookingValue: 'Average Booking',
      perReservation: 'per reservation',
      revenueByChannel: 'Revenue by Channel',
      paid: 'Paid',
      partial: 'Partial',
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
      reservations: 'reservaciones',
      unpaidBookings: 'reservas no pagadas',
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
    // Pestañas
    tabs: {
      all: 'Todas',
      pending: 'Pendientes',
      confirmed: 'Confirmadas',
      completed: 'Completadas',
      bookings: 'Reservas',
      reviews: 'Reseñas de Huéspedes',
      wishlists: 'Listas de Deseos',
    },
    // Reportes
    reports: {
      title: 'Reportes',
      bookingStatus: 'Estado de Reservas',
      confirmed: 'Confirmado',
      pending: 'Pendiente',
      completed: 'Completado',
      keyMetrics: 'Métricas Clave',
      avgRevenue: 'Ingresos Totales',
      avgOccupancy: 'Ocupación Promedio',
      totalBookings: 'Total de Reservas',
      avgPriceNight: 'Precio Promedio/Noche',
      totalNights: 'Total de Noches Reservadas',
      monthsOccupancy: 'meses de ocupación',
      avgBookingValue: 'Reserva Promedio',
      perReservation: 'por reserva',
      revenueByChannel: 'Ingresos por Canal',
      paid: 'Pagado',
      partial: 'Parcial',
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
