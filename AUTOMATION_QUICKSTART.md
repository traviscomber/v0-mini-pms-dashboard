# Integración Rápida - Automatización Hospitalaria

## 5 Pasos para Implementar

### 1️⃣ Importar el Hook
```typescript
import { useAutomation } from '@/app/pms/hooks/useAutomation';
```

### 2️⃣ Llamar el Hook
```typescript
const automation = useAutomation(
  reservations,  // Array de reservas
  tasks,         // Array de tareas
  alerts,        // Array de alertas
  setTasks,      // Callback para actualizar tareas
  setAlerts,     // Callback para actualizar alertas
  {
    autoGenerateTasks: true,
    autoCreateAlerts: true,
    autoUpdateCleaningStatus: true,
    notifyHoursBefore: 24
  }
);
```

### 3️⃣ Usar el Componente
```typescript
import AutomationDashboard from '@/app/pms/components/AutomationDashboard';

<AutomationDashboard
  tasks={automation.tasks}
  alerts={automation.alerts}
  criticalTasks={automation.criticalTasks}
  onTaskStatusChange={automation.updateTaskStatus}
  onAlertDismiss={automation.dismissAlert}
/>
```

### 4️⃣ (Opcional) Conectar Notificaciones
```typescript
// En useAutomation.ts, agregar en autoCreateAlerts():
if (newAlerts.length > 0) {
  await sendEmailNotifications(newAlerts);
  await sendSMSNotifications(newAlerts);
}
```

### 5️⃣ Compilar y Probar
```bash
npm run build
npm run dev
```

---

## Archivos Incluidos

| Archivo | Descripción |
|---------|-----------|
| `hooks/useAutomation.ts` | Lógica de automatización |
| `components/AutomationDashboard.tsx` | Dashboard visual |
| `components/examples/HospitalityAutomationExample.tsx` | Ejemplo completo |
| `components/Dashboard.tsx` | (Actualizado) Integración |

---

## Tareas Generadas Automáticamente

Cuando se crea una reserva, se generan estas tareas:

```
✓ Check-in task (día de arribo)
✓ Pre-arrival cleaning (2h antes de check-in)
✓ Check-out task (día de salida)
✓ Post-checkout cleaning (1h después de check-out)
✓ Inspection task (2h después de check-out)
✓ Payment reminder (si hay balance pendiente)
```

---

## Alertas Creadas Automáticamente

```
⏰ Check-in Alert (24h antes)
   → Tipo: check_in_today
   → Nivel: info
   → Descripción: "Guest X checking in at Y"

⚠️ Check-out Alert (2h antes)
   → Tipo: check_out_today
   → Nivel: warning
   → Descripción: "Guest X checking out at Y"

🚨 Payment Alert (24h antes de checkout, si hay balance)
   → Tipo: pending_payment
   → Nivel: critical
   → Descripción: "Guest X owes $Y"
```

---

## Métodos Disponibles

```typescript
automation.tasks                    // Array de tareas actuales
automation.alerts                   // Array de alertas actuales
automation.criticalTasks            // Array solo de tareas críticas

automation.updateTaskStatus(id, status)  // Cambiar estado de tarea
automation.dismissAlert(id)              // Descartar alerta
```

---

## Estados de Tareas

```
pending       → En espera
in_progress   → En progreso
completed     → Completada
cancelled     → Cancelada
```

---

## Niveles de Alerta

```
info          → Información general (azul)
warning       → Requiere atención (naranja)
critical      → Urgente (rojo)
```

---

## Ejemplo de Uso Completo

```tsx
import { useState } from 'react';
import { useAutomation } from '@/app/pms/hooks/useAutomation';
import AutomationDashboard from '@/app/pms/components/AutomationDashboard';

export default function MyPMS() {
  const [reservations] = useState([/* ... */]);
  const [tasks, setTasks] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Activar automatización
  const automation = useAutomation(
    reservations,
    tasks,
    alerts,
    setTasks,
    setAlerts
  );

  // Mostrar dashboard
  return (
    <AutomationDashboard
      tasks={automation.tasks}
      alerts={automation.alerts}
      criticalTasks={automation.criticalTasks}
      onTaskStatusChange={automation.updateTaskStatus}
      onAlertDismiss={automation.dismissAlert}
    />
  );
}
```

---

## Configuración Avanzada

```typescript
const automation = useAutomation(
  reservations,
  tasks,
  alerts,
  setTasks,
  setAlerts,
  {
    // Generar tareas automáticamente (default: true)
    autoGenerateTasks: true,
    
    // Crear alertas automáticamente (default: true)
    autoCreateAlerts: true,
    
    // Actualizar estado de limpieza (default: true)
    autoUpdateCleaningStatus: true,
    
    // Horas antes de notificar check-in (default: 24)
    notifyHoursBefore: 24,
  }
);
```

---

## Troubleshooting

**P: Las tareas no aparecen**
- ✓ Verifica que `autoGenerateTasks: true`
- ✓ Revisa que `onTasksChange` callback está funcionando
- ✓ Comprueba que las fechas de reserva son válidas

**P: Las alertas no se actualizan**
- ✓ El hook se ejecuta cada 5 minutos automáticamente
- ✓ Verifica que `autoCreateAlerts: true`
- ✓ Revisa que el estado de alerts se actualiza correctamente

**P: Las tareas críticas no aparecen en rojo**
- ✓ Comprueba que la prioridad es 'high' o 'urgent'
- ✓ Verifica que la fecha de vencimiento es hoy o anterior

---

¡Listo para usar! 🚀
