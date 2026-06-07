'use client';

import { useState, useMemo } from 'react';
import { AuditLog, AuditEntity, AuditAction } from '../types';
import { Search, Filter, Eye } from 'lucide-react';

interface AuditLogViewerProps {
  auditLogs: AuditLog[];
}

const actionColors: Record<AuditAction, string> = {
  create: 'bg-green-500/10 text-green-700',
  update: 'bg-blue-500/10 text-blue-700',
  delete: 'bg-red-500/10 text-red-700',
  assign: 'bg-purple-500/10 text-purple-700',
  complete: 'bg-cyan-500/10 text-cyan-700',
  cancel: 'bg-orange-500/10 text-orange-700',
};

export default function AuditLogViewer({ auditLogs }: AuditLogViewerProps) {
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

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-4">
        <p className="text-sm text-foreground/60">
          Complete audit trail of all system actions for accountability and compliance.
        </p>
      </div>

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
