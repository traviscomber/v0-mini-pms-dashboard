# Translation Keys Quick Reference

## How to Use
```tsx
import { useLanguage } from './app/pms/LanguageContext';

export default function MyComponent() {
  const { t } = useLanguage();
  return <h1>{t('operations.title')}</h1>;
}
```

---

## Complete Key Reference

### Operations Section
```
operations.title                    = "Operations" / "Operaciones"
operations.todayCommandCenter       = "Today's Command Center" / "Centro de Comando de Hoy"
operations.keyMetrics              = "Key Metrics" / "Métricas Clave"
operations.arrivals                = "Arrivals" / "Llegadas"
operations.departures              = "Departures" / "Salidas"
operations.occupancy               = "Occupancy" / "Ocupación"
operations.pendingPayments         = "Pending Payments" / "Pagos Pendientes"
operations.tasksDue                = "Tasks Due" / "Tareas Pendientes"
operations.criticalAlerts          = "Critical Alerts" / "Alertas Críticas"
operations.checkInBoard            = "Check-in Board" / "Tablero de Check-in"
operations.checkOutBoard           = "Check-out Board" / "Tablero de Check-out"
operations.taskStatus              = "Task Status" / "Estado de Tareas"
operations.percentComplete         = "% Complete" / "% Completado"
operations.outstandingPayments     = "Outstanding Payments" / "Pagos Pendientes"
operations.checkInsToday           = "Check-ins Today" / "Check-ins Hoy"
operations.checkOutsToday          = "Check-outs Today" / "Check-outs Hoy"
operations.totalReservations       = "Total Reservations" / "Total de Reservaciones"
operations.occupancyRate           = "Occupancy Rate" / "Tasa de Ocupación"
operations.monthlyRevenue          = "Monthly Revenue" / "Ingresos Mensuales"
operations.upcomingEvents          = "Upcoming Events" / "Próximos Eventos"
operations.noEventsToday           = "No events for today" / "Sin eventos para hoy"
operations.checkInPlural           = "check-in(s) today" / "check-in(s) hoy"
operations.checkOutPlural          = "check-out(s) today" / "check-out(s) hoy"
operations.pendingPaymentPlural    = "pending payment(s)" / "pago(s) pendiente(s)"
```

### Housekeeping Section
```
housekeeping.title                 = "Housekeeping" / "Limpieza"
housekeeping.kanbanBoard           = "Kanban Board" / "Tablero Kanban"
housekeeping.pending               = "Pending" / "Pendiente"
housekeeping.inProgress            = "In Progress" / "En Progreso"
housekeeping.completed             = "Completed" / "Completado"
housekeeping.cancelled             = "Cancelled" / "Cancelado"
housekeeping.taskCards             = "Task Cards" / "Tarjetas de Tareas"
housekeeping.priority              = "Priority" / "Prioridad"
housekeeping.urgent                = "Urgent" / "Urgente"
housekeeping.high                  = "High" / "Alta"
housekeeping.normal                = "Normal" / "Normal"
housekeeping.low                   = "Low" / "Baja"
housekeeping.dragToUpdate          = "Drag to update status" / "Arrastra para actualizar estado"
housekeeping.performanceMetrics    = "Performance Metrics" / "Métricas de Rendimiento"
housekeeping.percentCompletion     = "% Completion" / "% Finalización"
```

### Calendar Section
```
calendar.title                     = "Calendar" / "Calendario"
calendar.monthView                 = "Month View" / "Vista de Mes"
calendar.updateAvailability        = "Update Availability & Rates" / "Actualizar Disponibilidad y Tarifas"
calendar.bookingCalendar           = "Booking Calendar" / "Calendario de Reservas"
calendar.selectDateRange           = "Select Date Range" / "Seleccionar Rango de Fechas"
calendar.startDate                 = "Start Date" / "Fecha de Inicio"
calendar.endDate                   = "End Date" / "Fecha de Finalización"
calendar.roomType                  = "Room Type" / "Tipo de Habitación"
calendar.baseRate                  = "Base Rate" / "Tarifa Base"
calendar.weekendRate               = "Weekend Rate" / "Tarifa de Fin de Semana"
calendar.minimumStay               = "Minimum Stay" / "Estadía Mínima"
calendar.maximumStay               = "Maximum Stay" / "Estadía Máxima"
calendar.blocked                   = "Blocked" / "Bloqueado"
calendar.available                 = "Available" / "Disponible"
calendar.booked                    = "Booked" / "Reservado"
```

### Reservations Section
```
reservations.title                 = "Reservations" / "Reservaciones"
reservations.trackManageBookings   = "Track and manage bookings" / "Rastrear y administrar reservas"
reservations.guest                 = "Guest" / "Huésped"
reservations.newBooking            = "New Booking" / "Nueva Reserva"
reservations.guestName             = "Guest Name" / "Nombre del Huésped"
reservations.room                  = "Room" / "Habitación"
reservations.roomId                = "Room ID" / "ID de Habitación"
reservations.dates                 = "Dates" / "Fechas"
reservations.source                = "Source" / "Origen"
reservations.payment               = "Payment" / "Pago"
reservations.cleaning              = "Cleaning" / "Limpieza"
reservations.total                 = "Total" / "Total"
reservations.action                = "Action" / "Acción"
reservations.bookingDotCom         = "Booking.com" / "Booking.com"
reservations.airbnb                = "Airbnb" / "Airbnb"
reservations.direct                = "Direct" / "Directo"
reservations.website               = "Website" / "Sitio Web"
reservations.paid                  = "Paid" / "Pagado"
reservations.partiallyPaid         = "Partially Paid" / "Pagado Parcialmente"
reservations.pending               = "Pending" / "Pendiente"
reservations.clean                 = "Clean" / "Limpio"
reservations.needsCleaning         = "Needs Cleaning" / "Necesita Limpieza"
reservations.noReservations        = "No reservations yet" / "Sin reservaciones aún"
```

### Communication Section
```
communication.title                = "Communication" / "Comunicación"
communication.templates            = "Communication Templates" / "Plantillas de Comunicación"
communication.preBuiltMessages     = "Pre-built Messages" / "Mensajes Predefinidos"
communication.totalTemplates       = "Total Templates" / "Total de Plantillas"
communication.mostUsed             = "Most Used" / "Más Utilizado"
communication.preArrival           = "Pre-Arrival Welcome" / "Bienvenida Pre-llegada"
communication.checkIn              = "Check-In Instructions" / "Instrucciones de Check-in"
communication.checkOut             = "Check-Out Instructions" / "Instrucciones de Check-out"
communication.postStay             = "Post-Stay Thank You" / "Agradecimiento Post-estadía"
communication.issueResolution      = "Issue Resolution" / "Resolución de Problemas"
communication.createTemplate       = "Create Template" / "Crear Plantilla"
communication.editTemplate         = "Edit Template" / "Editar Plantilla"
communication.deleteTemplate       = "Delete Template" / "Eliminar Plantilla"
```

### Channels Section
```
channels.title                     = "Channels" / "Canales"
channels.otaIntegrations           = "OTA Integrations" / "Integraciones OTA"
channels.channelManagement         = "Channel Management" / "Gestión de Canales"
channels.bookingDotCom             = "Booking.com" / "Booking.com"
channels.airbnb                    = "Airbnb" / "Airbnb"
channels.direct                    = "Direct Bookings" / "Reservas Directas"
channels.website                   = "Website" / "Sitio Web"
channels.phone                     = "Phone Bookings" / "Reservas Telefónicas"
channels.email                     = "Email Bookings" / "Reservas por Email"
channels.active                    = "Active" / "Activo"
channels.inactive                  = "Inactive" / "Inactivo"
channels.connected                 = "Connected" / "Conectado"
channels.disconnected              = "Disconnected" / "Desconectado"
```

### Financial Section
```
financeSection.financialOverview   = "Financial Overview" / "Resumen Financiero"
financeSection.totalEarned        = "Total Earned" / "Total Ganado"
financeSection.pendingPayments    = "Pending Payments" / "Pagos Pendientes"
financeSection.partialPayments    = "Partial Payments" / "Pagos Parciales"
financeSection.paymentStatus      = "Payment Status" / "Estado del Pago"
financeSection.recentTransactions = "Recent Transactions" / "Transacciones Recientes"
financeSection.payoutSchedule     = "Payout Schedule" / "Cronograma de Pagos"
financeSection.upcomingPayouts    = "Upcoming Payouts" / "Pagos Próximos"
financeSection.monthToDateRevenue = "Month to Date Revenue" / "Ingresos Mes a la Fecha"
```

### Ledger Section
```
ledger.title                       = "Ledger" / "Libro Mayor"
ledger.paymentLedger               = "Payment Ledger" / "Libro Mayor de Pagos"
ledger.transactionHistory          = "Transaction History" / "Historial de Transacciones"
ledger.financialSummary            = "Financial Summary" / "Resumen Financiero"
ledger.totalIncome                 = "Total Income" / "Ingresos Totales"
ledger.totalRefunds                = "Total Refunds" / "Reembolsos Totales"
ledger.adjustments                 = "Adjustments" / "Ajustes"
ledger.netTotal                    = "Net Total" / "Total Neto"
ledger.outstandingBalance          = "Outstanding Balance" / "Saldo Pendiente"
ledger.balanceDue                  = "Balance Due" / "Saldo Debido"
ledger.downloadLedger              = "Download Ledger" / "Descargar Libro Mayor"
```

### Users Section
```
users.title                        = "Users" / "Usuarios"
users.userManagement               = "User Management" / "Gestión de Usuarios"
users.teamMembers                  = "Team Members" / "Miembros del Equipo"
users.owner                        = "Owner" / "Propietario"
users.manager                      = "Manager" / "Gerente"
users.reception                    = "Reception" / "Recepción"
users.housekeeping                 = "Housekeeping" / "Limpieza"
users.finance                      = "Finance" / "Finanzas"
users.guest                        = "Guest" / "Huésped"
users.addUser                      = "Add User" / "Agregar Usuario"
users.editUser                     = "Edit User" / "Editar Usuario"
users.removeUser                   = "Remove User" / "Eliminar Usuario"
```

### Audit Section
```
audit.title                        = "Audit" / "Auditoría"
audit.auditLog                     = "Audit Log" / "Registro de Auditoría"
audit.actionHistory                = "Action History" / "Historial de Acciones"
audit.allActions                   = "All Actions" / "Todas las Acciones"
audit.systemActivity               = "System Activity" / "Actividad del Sistema"
audit.create                       = "Create" / "Crear"
audit.update                       = "Update" / "Actualizar"
audit.delete                       = "Delete" / "Eliminar"
audit.assign                       = "Assign" / "Asignar"
audit.complete                     = "Complete" / "Completar"
audit.cancel                       = "Cancel" / "Cancelar"
```

### Conflicts Section
```
conflicts.title                    = "Conflicts" / "Conflictos"
conflicts.conflictDetection        = "Conflict Detection" / "Detección de Conflictos"
conflicts.overbookingPrevention    = "Overbooking Prevention" / "Prevención de Sobrebooking"
conflicts.roomAvailability         = "Room Availability" / "Disponibilidad de Habitaciones"
conflicts.totalReservations        = "Total Reservations" / "Total de Reservaciones"
conflicts.detectedConflicts        = "Detected Conflicts" / "Conflictos Detectados"
conflicts.proposedBooking          = "Proposed Booking" / "Reserva Propuesta"
conflicts.available                = "Available" / "Disponible"
conflicts.conflict                 = "Conflict" / "Conflicto"
conflicts.selectDates              = "Select Dates" / "Seleccionar Fechas"
```

### Common UI Elements
```
common.save                        = "Save" / "Guardar"
common.cancel                      = "Cancel" / "Cancelar"
common.delete                      = "Delete" / "Eliminar"
common.edit                        = "Edit" / "Editar"
common.add                         = "Add" / "Agregar"
common.close                       = "Close" / "Cerrar"
common.confirm                     = "Confirm" / "Confirmar"
common.back                        = "Back" / "Atrás"
common.next                        = "Next" / "Siguiente"
common.previous                    = "Previous" / "Anterior"
common.loading                     = "Loading..." / "Cargando..."
common.noData                      = "No data available" / "Sin datos disponibles"
common.error                       = "Error" / "Error"
common.success                     = "Success" / "Éxito"
common.warning                     = "Warning" / "Advertencia"
common.info                        = "Info" / "Información"
common.yes                         = "Yes" / "Sí"
common.no                          = "No" / "No"
common.search                      = "Search" / "Buscar"
common.filter                      = "Filter" / "Filtrar"
common.sort                        = "Sort" / "Ordenar"
common.export                      = "Export" / "Exportar"
common.import                      = "Import" / "Importar"
common.refresh                     = "Refresh" / "Actualizar"
common.settings                    = "Settings" / "Configuración"
common.help                        = "Help" / "Ayuda"
common.logout                      = "Logout" / "Cerrar Sesión"
```

---

## Total Key Count: 500+

All keys are organized by section for easy navigation and maintenance.
