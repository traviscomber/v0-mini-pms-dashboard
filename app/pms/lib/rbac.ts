import { UserRole } from '../types';

export const rolePermissions: Record<UserRole, string[]> = {
  owner: [
    'view_all',
    'manage_users',
    'view_financials',
    'configure_system',
    'view_audit_logs',
    'manage_channels',
  ],
  manager: [
    'view_all',
    'view_financials',
    'view_audit_logs',
    'manage_reservations',
    'assign_tasks',
    'approve_payments',
  ],
  reception: [
    'manage_reservations',
    'check_in_out',
    'view_guest_details',
    'manage_payments',
    'view_today_tasks',
  ],
  housekeeping: [
    'view_assigned_tasks',
    'update_task_status',
    'view_room_status',
  ],
  finance: [
    'view_financials',
    'manage_payments',
    'view_ledger',
    'generate_reports',
    'view_audit_logs',
  ],
  guest: [
    'view_own_reservation',
    'communicate_property',
  ],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    owner: 'Full access - manage all operations and users',
    manager: 'Operations management - reservations, payments, reporting',
    reception: 'Guest-facing - check-in/out, reservations, payments',
    housekeeping: 'Task management - cleaning and maintenance tasks only',
    finance: 'Financial operations - payments, ledger, reports',
    guest: 'Read-only - view own reservation details',
  };
  return descriptions[role];
}

export const roleColors: Record<UserRole, string> = {
  owner: 'bg-purple-500/20 text-purple-700',
  manager: 'bg-blue-500/20 text-blue-700',
  reception: 'bg-green-500/20 text-green-700',
  housekeeping: 'bg-orange-500/20 text-orange-700',
  finance: 'bg-cyan-500/20 text-cyan-700',
  guest: 'bg-gray-500/20 text-gray-700',
};
