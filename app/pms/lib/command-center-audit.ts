export interface CommandCenterAuditEntry {
  id: string;
  timestamp: string;
  source: string;
  action: string;
  target: string;
  detail: string;
}

export const COMMAND_CENTER_AUDIT_STORAGE_KEY = 'pms-command-center-audit';
export const COMMAND_CENTER_AUDIT_EVENT = 'pms-command-center-audit-updated';

export function readCommandCenterAuditTrail(): CommandCenterAuditEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawAuditTrail = window.localStorage.getItem(COMMAND_CENTER_AUDIT_STORAGE_KEY);

    if (!rawAuditTrail) {
      return [];
    }

    const parsedAuditTrail = JSON.parse(rawAuditTrail) as CommandCenterAuditEntry[];
    return Array.isArray(parsedAuditTrail) ? parsedAuditTrail.slice(0, 8) : [];
  } catch {
    return [];
  }
}
