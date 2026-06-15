'use client';

import { useState, useMemo } from 'react';
import { AuditLog, AuditEntity, AuditAction } from '../types';
import { Search, Filter, Eye } from 'lucide-react';
import type { CommandCenterAuditEntry } from '../lib/command-center-audit';

interface AuditLogViewerProps {
  auditLogs: AuditLog[];
  sessionAuditTrail?: CommandCenterAuditEntry[];
}

const actionColors: Record<AuditAction, string> = {
  create: 'bg-chart-2/10 text-green-700',
  update: 'bg-primary/10 text-primary',
  delete: 'bg-destructive/10 text-red-700',
  assign: 'bg-accent500/10 text-accent700',
  complete: 'bg-accent500/10 text-accent700',
  cancel: 'bg-destructive500/10 text-destructive700',
};

export default function AuditLogViewer({ auditLogs, sessionAuditTrail = [] }: AuditLogViewerProps) {
  const [searchText, setSearchText] = useState('');
  const [filterEntity, setFilterEntity] = useState('all');
  const [filterAction, setFilterAction] = useState('all');

  const filteredLogs = useMemo(() => {
    return auditLogs
      .filter((log) => {
        if (searchText && !log.performedBy.toLowerCase().includes(searchText.toLowerCase())) {
          return false;
        }
        if (filterEntity !== 'all' && log.entityType !== filterEntity) return false;
        if (filterAction !== 'all' && log.action !== filterAction) return false;
        return true;
      })
      .sort((a, b) => b.performedAt.getTime() - a.performedAt.getTime());
  }, [auditLogs, searchText, filterEntity, filterAction]);

  const formatSessionTime = (timestamp: string) =>
    new Intl.DateTimeFormat('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: 'numeric',
    }).format(new Date(timestamp));

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-4">
        <p className="text-sm text-foreground/60">
          Complete audit trail of all system actions for accountability and compliance.
        </p>
      </div>

      {sessionAuditTrail.length > 0 ? (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Live session trail</p>
              <p className="mt-1 text-sm text-foreground/60">
                Actions recorded from the command center in the current session.
              </p>
            </div>
            <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground/60">
              {sessionAuditTrail.length} events
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {sessionAuditTrail.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-border bg-background/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">{entry.source}</p>
                    <h4 className="mt-1 text-sm font-semibold text-foreground">{entry.action}</h4>
                  </div>
                  <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-foreground/60">
                    {entry.target}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-foreground/65">{entry.detail}</p>
                <p className="mt-3 text-xs text-foreground/45">{formatSessionTime(entry.timestamp)}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg flex-1 min-w-xs">
          <Search className="w-4 h-4 text-foreground/60" />
          <input
            type="text"
            placeholder="Search by user..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        <select
          value={filterEntity}
          onChange={(e) => setFilterEntity(e.target.value)}
          className="px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none"
        >
          <option value="all">All Entities</option>
          <option value="reservation">Reservations</option>
          <option value="task">Tasks</option>
          <option value="payment">Payments</option>
          <option value="user">Users</option>
        </select>

        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none"
        >
          <option value="all">All Actions</option>
          <option value="create">Created</option>
          <option value="update">Updated</option>
          <option value="delete">Deleted</option>
          <option value="assign">Assigned</option>
          <option value="complete">Completed</option>
          <option value="cancel">Cancelled</option>
        </select>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-4 py-3 text-left font-semibold">Date & Time</th>
                <th className="px-4 py-3 text-left font-semibold">User</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
                <th className="px-4 py-3 text-left font-semibold">Entity</th>
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-left font-semibold">Changes</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr
                  key={log.id}
                  className={idx % 2 === 0 ? 'border-b border-border' : 'border-b border-border bg-background/50'}
                >
                  <td className="px-4 py-3 text-xs text-foreground/60 whitespace-nowrap">
                    {log.performedAt.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium">{log.performedBy}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded capitalize ${actionColors[log.action]}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground/60 capitalize">
                    {log.entityType}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-foreground/50">
                    {log.entityId.substring(0, 12)}...
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <details className="cursor-pointer">
                      <summary className="text-foreground/60 hover:text-foreground transition">
                        View ({Object.keys(log.changes).length})
                      </summary>
                      <div className="mt-2 p-2 bg-background rounded text-xs font-mono text-foreground/70">
                        {JSON.stringify(log.changes, null, 2)}
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <div className="flex items-center justify-center h-32 bg-card border border-border rounded-lg">
          <p className="text-foreground/60">No audit logs found</p>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg p-4">
        <p className="text-xs text-foreground/60">
          Total audit entries: {auditLogs.length} | Showing: {filteredLogs.length}
        </p>
      </div>
    </div>
  );
}
