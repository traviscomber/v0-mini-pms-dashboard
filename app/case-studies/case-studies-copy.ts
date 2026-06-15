export type CaseStudyLang = 'es' | 'en';

export const CASE_STUDIES_LANG_STORAGE_KEY = 'n3-landing-lang';

export const CASE_STUDIES_COPY = {
  es: {
    indexTitle: 'Referencias que prueban la plataforma en el mundo real.',
    indexSubtitle:
      'Mantenemos la marca pública genérica, mientras cada caso muestra cómo Yagán coordina operaciones reales, trazabilidad y servicio.',
    indexBack: 'Volver al inicio',
    indexCardSubtitle: 'Primer cliente de referencia',
    indexCardDescription:
      'Un despliegue en producción que abarca hospitalidad, administración, operaciones de campo e infraestructura bajo un solo modelo operativo.',
    indexCardHighlights: ['Multi-vertical', 'Flujo real', 'Acciones trazables'],
    indexMoreTitle: 'Más casos próximamente',
    indexMoreDescription:
      'A medida que Yagán crezca, agregaremos más cuentas de referencia, modelos operativos e historias de implementación.',
    indexMoreNote: 'Referencias de clientes disponibles a solicitud',
    indexProofTitle: 'Por qué importa',
    indexProofBody:
      'Cada referencia está pensada para mostrar profundidad operativa: una plataforma real, responsabilidad visible y un camino claro desde la señal hasta la acción.',
    indexProofBadge: 'Hecho para operadores que necesitan confianza antes del rollout.',
    blackswanTitle: 'Blackswan como primera referencia en producción.',
    blackswanSubtitle:
      'Un despliegue real que demuestra que Yagán coordina múltiples capas operativas sin fragmentar la experiencia del usuario.',
    blackswanBack: 'Volver a casos',
    blackswanTag: 'Primer cliente de referencia',
    blackswanMeta: 'Despliegue multi-vertical',
    blackswanIntro:
      'Blackswan muestra cómo opera Yagán en el mundo real: un solo workspace para hospitalidad, administración, operaciones de campo e infraestructura. El resultado es menos cambio de contexto, traspasos más limpios y un sistema en el que los líderes realmente pueden confiar.',
    blackswanHighlights: [
      {
        title: 'Hospitalidad',
        text: 'Flujos de servicio al huésped, concierge y visibilidad ejecutiva en un solo espacio.',
      },
      {
        title: 'Administración',
        text: 'Presupuestos, dotación y contexto operacional en lugar de herramientas separadas.',
      },
      {
        title: 'Operaciones de campo',
        text: 'Colas de trabajo, mantenimiento y ejecución con un modelo claro de propiedad.',
      },
      {
        title: 'Infraestructura',
        text: 'Activos, inventario y control de sitio con trazabilidad lista para auditoría.',
      },
    ],
    blackswanImpactTitle: 'Qué cambió',
    blackswanImpactSubtitle: 'Un sistema ahora coordina cuatro capas operativas.',
    blackswanOutcomes: [
      { label: 'Capas operativas', value: '4' },
      { label: 'Plano de control', value: 'Unificado' },
      { label: 'Trazabilidad', value: 'Total' },
      { label: 'Escalabilidad', value: 'Multi-sitio' },
    ],
    blackswanDayLabel: 'Día en la operación',
    blackswanDayTitle: 'Un ritmo simple desde el briefing hasta el cierre.',
    blackswanTimeline: [
      { time: '07:00', title: 'Comienza con un brief limpio', text: 'La torre de control abre con una vista única de prioridades, riesgo y ownership.' },
      { time: '10:00', title: 'Ruta el día por especialidad', text: 'Hospitalidad, administración, campo e infraestructura reciben su propia pista.' },
      { time: '14:00', title: 'Seguimiento visible', text: 'Cada tarea asignada permanece visible, trazable y lista para revisión.' },
      { time: '19:00', title: 'Cierre con confianza', text: 'Los líderes revisan qué cambió, qué sigue abierto y qué hereda el siguiente turno.' },
    ],
    blackswanWhyTitle: 'Por qué importa',
    blackswanWhyBody:
      'Blackswan valida el producto en múltiples categorías operativas y le da al sitio público un ancla clara de credibilidad.',
    blackswanTakeawayTitle: 'Idea central',
    blackswanTakeawayBody:
      'Un solo plano de control puede coordinar servicio, activos, trabajo de campo y gestión sin fragmentar la experiencia del operador.',
    blackswanConfidence: 'Listo para producción',
    blackswanVisibility: 'Trazabilidad total',
    blackswanDemo: 'Abrir demo interna',
    blackswanPublicTitle: 'Posicionamiento público',
    blackswanPublicBody:
      'El sitio público se mantiene genérico. Blackswan es el punto de prueba que demuestra la plataforma en un entorno real.',
  },
  en: {
    indexTitle: 'Reference accounts that prove the platform in the real world.',
    indexSubtitle:
      'We keep the public brand generic while each case study shows how Yagán coordinates live operations, traceability, and service.',
    indexBack: 'Back home',
    indexCardSubtitle: 'First reference account',
    indexCardDescription:
      'A production deployment spanning hospitality, administration, field operations, and infrastructure under one operating model.',
    indexCardHighlights: ['Multi-vertical', 'Real workflow', 'Traceable actions'],
    indexMoreTitle: 'More coming',
    indexMoreDescription:
      'As Yagán grows, we will add more reference accounts, operating models, and implementation stories.',
    indexMoreNote: 'Client references available on request',
    indexProofTitle: 'Why it matters',
    indexProofBody:
      'Each reference is designed to show real operational depth: a working stack, visible accountability, and a clear path from signal to action.',
    indexProofBadge: 'Built for operators who need confidence before rollout.',
    blackswanTitle: 'Blackswan as the first production reference.',
    blackswanSubtitle:
      'A real deployment that proves Yagán can coordinate multiple operational layers without fragmenting the user experience.',
    blackswanBack: 'Back to cases',
    blackswanTag: 'First reference account',
    blackswanMeta: 'Multi-vertical deployment',
    blackswanIntro:
      'Blackswan shows how Yagán operates in the wild: one workspace for hospitality, administration, field operations, and infrastructure. The result is less context switching, cleaner handoffs, and a system that leaders can actually trust.',
    blackswanHighlights: [
      {
        title: 'Hospitality',
        text: 'Guest service, concierge flows, and executive visibility in one shared workspace.',
      },
      {
        title: 'Administration',
        text: 'Budgets, staffing, and operational context kept together instead of scattered across tools.',
      },
      {
        title: 'Field operations',
        text: 'Work queues, maintenance, and execution follow a clear ownership model.',
      },
      {
        title: 'Infrastructure',
        text: 'Assets, inventory, and site control with audit-ready traceability.',
      },
    ],
    blackswanImpactTitle: 'What changed',
    blackswanImpactSubtitle: 'One system now handles four operational layers.',
    blackswanOutcomes: [
      { label: 'Operational layers', value: '4' },
      { label: 'Control plane', value: 'Unified' },
      { label: 'Traceability', value: 'Full' },
      { label: 'Deployment shape', value: 'Multi-site ready' },
    ],
    blackswanDayLabel: 'Day in the operation',
    blackswanDayTitle: 'A simple rhythm from briefing to close.',
    blackswanTimeline: [
      { time: '07:00', title: 'Start with a clean brief', text: 'The control tower opens with a single view of priorities, risk, and ownership.' },
      { time: '10:00', title: 'Route the day by specialty', text: 'Hospitality, admin, field work, and infrastructure each get their own lane.' },
      { time: '14:00', title: 'Track action and follow-through', text: 'Each assignment remains visible, traceable, and ready for review.' },
      { time: '19:00', title: 'Close with confidence', text: 'Leaders review what changed, what remains open, and what the next shift should inherit.' },
    ],
    blackswanWhyTitle: 'Why it matters',
    blackswanWhyBody:
      'Blackswan validates the product across multiple operational categories and gives the public site a clear credibility anchor.',
    blackswanTakeawayTitle: 'Core takeaway',
    blackswanTakeawayBody:
      'One control plane can coordinate service, assets, field work, and management without fragmenting the operator experience.',
    blackswanConfidence: 'Production-ready',
    blackswanVisibility: 'Full traceability',
    blackswanDemo: 'Open internal demo',
    blackswanPublicTitle: 'Public positioning',
    blackswanPublicBody:
      'The public site stays generic. Blackswan is the proof point that shows the platform in a live environment.',
  },
} satisfies Record<CaseStudyLang, Record<string, unknown>>;

export function readCaseStudyLanguage(): CaseStudyLang {
  if (typeof window === 'undefined') {
    return 'es';
  }

  try {
    const saved = window.localStorage.getItem(CASE_STUDIES_LANG_STORAGE_KEY);
    return saved === 'en' ? 'en' : 'es';
  } catch {
    return 'es';
  }
}
