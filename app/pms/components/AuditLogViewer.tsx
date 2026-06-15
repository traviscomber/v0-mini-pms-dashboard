'use client';

import { useMemo, useState } from 'react';
import { AuditLog, AuditEntity, AuditAction } from '../types';
import { CheckCircle2, Download, Search, Filter, Eye, ShieldAlert, TriangleAlert } from 'lucide-react';
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
  approve: 'bg-emerald-500/10 text-emerald-200',
  reject: 'bg-rose-500/10 text-rose-200',
};

export default function AuditLogViewer({ auditLogs, sessionAuditTrail = [] }: AuditLogViewerProps) {
  const [searchText, setSearchText] = useState('');
  const [filterEntity, setFilterEntity] = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [sessionAgentFilter, setSessionAgentFilter] = useState('all');
  const [sessionSeverityFilter, setSessionSeverityFilter] = useState('all');
  const [complianceMode, setComplianceMode] = useState(true);

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

  const getSessionSeverity = (entry: CommandCenterAuditEntry) => {
    const action = entry.action.toLowerCase();
    const target = entry.target.toLowerCase();

    if (action.includes('escalat') || target === 'ledger') {
      return 'high';
    }

    if (action.includes('execut') || action.includes('copy')) {
      return 'medium';
    }

    return 'low';
  };

  const sessionAgentOptions = useMemo(
    () => ['all', ...new Set(sessionAuditTrail.map((entry) => entry.source))],
    [sessionAuditTrail],
  );

  const filteredSessionTrail = useMemo(() => {
    return sessionAuditTrail.filter((entry) => {
      if (sessionAgentFilter !== 'all' && entry.source !== sessionAgentFilter) {
        return false;
      }

      if (sessionSeverityFilter !== 'all' && getSessionSeverity(entry) !== sessionSeverityFilter) {
        return false;
      }

      if (searchText) {
        const query = searchText.toLowerCase();
        const haystack = `${entry.source} ${entry.action} ${entry.target} ${entry.detail}`.toLowerCase();

        if (!haystack.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [searchText, sessionAgentFilter, sessionAuditTrail, sessionSeverityFilter]);

  const sessionSummary = useMemo(() => {
    const severityCounts = filteredSessionTrail.reduce(
      (counts, entry) => {
        counts[getSessionSeverity(entry)] += 1;
        return counts;
      },
      { high: 0, medium: 0, low: 0 },
    );

    const agentCounts = filteredSessionTrail.reduce<Record<string, number>>((counts, entry) => {
      counts[entry.source] = (counts[entry.source] ?? 0) + 1;
      return counts;
    }, {});

    const topAgent = Object.entries(agentCounts).sort((left, right) => right[1] - left[1])[0]?.[0] ?? 'None';

    return {
      events: filteredSessionTrail.length,
      severityCounts,
      topAgent,
    };
  }, [filteredSessionTrail]);

  const policyChecks = useMemo(() => {
    const hasHighSeverity = sessionSummary.severityCounts.high > 0;
    const hasManyEvents = sessionSummary.events >= 5;
    const hasLedgerActivity = filteredSessionTrail.some((entry) => entry.target === 'ledger');
    const hasEscalations = filteredSessionTrail.some((entry) => entry.action.toLowerCase().includes('escalat'));

    return [
      {
        label: 'High-severity actions',
        status: hasHighSeverity ? 'review' : 'pass',
        detail: hasHighSeverity
          ? `${sessionSummary.severityCounts.high} event(s) need a human review before close.`
          : 'No high-severity actions detected in the active filters.',
      },
      {
        label: 'Ledger exposure',
        status: hasLedgerActivity ? 'review' : 'pass',
        detail: hasLedgerActivity
          ? 'Ledger-touching actions are visible and should be checked for financial impact.'
          : 'No ledger activity is present in the current trail.',
      },
      {
        label: 'Escalation signal',
        status: hasEscalations ? 'watch' : 'pass',
        detail: hasEscalations
          ? 'The trail includes explicit escalations and should stay visible to the duty lead.'
          : 'No escalations were recorded in the current session.',
      },
      {
        label: 'Operating volume',
        status: hasManyEvents ? 'watch' : 'pass',
        detail: hasManyEvents
          ? `${sessionSummary.events} event(s) are enough to justify a short end-of-shift review.`
          : 'Activity volume remains light.',
      },
    ] as const;
  }, [filteredSessionTrail, sessionSummary.events, sessionSummary.severityCounts.high]);

  const goNoGoRecommendation = useMemo(() => {
    const flags = policyChecks.filter((check) => check.status !== 'pass').length;
    const shouldBlock = policyChecks.some((check) => check.status === 'review');
    const shouldWatch = !shouldBlock && policyChecks.some((check) => check.status === 'watch');

    if (shouldBlock) {
      return {
        label: 'No-go',
        icon: ShieldAlert,
        tone: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
        detail: 'A human should review the session before closing because one or more policy checks need attention.',
        nextStep: 'Review the flags, especially ledger and high-severity items.',
        flags,
      } as const;
    }

    if (shouldWatch) {
      return {
        label: 'Go with watch',
        icon: TriangleAlert,
        tone: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
        detail: 'The trail is mostly healthy, but there is enough activity to keep an eye on the close.',
        nextStep: 'Proceed with a short end-of-shift review.',
        flags,
      } as const;
    }

    return {
      label: 'Go',
      icon: CheckCircle2,
      tone: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
      detail: 'No blocking signals detected in the active trail.',
      nextStep: 'Safe to close the session and export the bundle if needed.',
      flags,
    } as const;
  }, [policyChecks]);

  const exportSessionTrail = () => {
    if (typeof window === 'undefined' || filteredSessionTrail.length === 0) {
      return;
    }

    const payload = filteredSessionTrail.map((entry) => ({
      ...entry,
      severity: getSessionSeverity(entry),
      timestamp: new Date(entry.timestamp).toISOString(),
    }));

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `command-center-audit-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportSessionTrailCsv = () => {
    if (typeof window === 'undefined' || filteredSessionTrail.length === 0) {
      return;
    }

    const header = ['timestamp', 'source', 'action', 'target', 'severity', 'detail'];
    const rows = filteredSessionTrail.map((entry) => [
      new Date(entry.timestamp).toISOString(),
      entry.source,
      entry.action,
      entry.target,
      getSessionSeverity(entry),
      entry.detail,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `command-center-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportComplianceBundle = () => {
    if (typeof window === 'undefined' || filteredSessionTrail.length === 0) {
      return;
    }

    const bundle = {
      exportedAt: new Date().toISOString(),
      complianceMode,
      summary: sessionSummary,
      filters: {
        agent: sessionAgentFilter,
        severity: sessionSeverityFilter,
        search: searchText,
      },
      sessionAuditTrail: filteredSessionTrail.map((entry) => ({
        ...entry,
        severity: getSessionSeverity(entry),
      })),
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `audit-bundle-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

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
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground/60">
                {sessionAuditTrail.length} events
              </span>
              <button
                type="button"
                onClick={() => setComplianceMode((currentMode) => !currentMode)}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/70 transition hover:border-primary/25 hover:text-foreground"
              >
                {complianceMode ? 'Compliance mode' : 'Operational mode'}
              </button>
            </div>
          </div>

          {complianceMode ? (
            <div className="space-y-3">
                <div className="grid gap-3 md:grid-cols-4">
                  <div className="rounded-2xl border border-border bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Visible events</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">{sessionSummary.events}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">High severity</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">{sessionSummary.severityCounts.high}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Medium severity</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">{sessionSummary.severityCounts.medium}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Top agent</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{sessionSummary.topAgent}</p>
                  </div>
                </div>

              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Policy check</p>
                    <p className="mt-1 text-sm text-foreground/60">
                      Fast signals that tell a lead what needs review before closing the session.
                    </p>
                  </div>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground/60">
                    {policyChecks.filter((check) => check.status !== 'pass').length} flags
                  </span>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {policyChecks.map((check) => (
                    <article key={check.label} className="rounded-2xl border border-border bg-card/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-foreground">{check.label}</p>
                        <span
                          className={[
                            'rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em]',
                            check.status === 'review'
                              ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
                              : check.status === 'watch'
                                ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
                          ].join(' ')}
                        >
                          {check.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-foreground/65">{check.detail}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className={`rounded-2xl border p-4 ${goNoGoRecommendation.tone}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em]">Go / no-go</p>
                    <h4 className="mt-1 text-lg font-semibold text-foreground">{goNoGoRecommendation.label}</h4>
                  </div>
                  <goNoGoRecommendation.icon className="h-5 w-5" />
                </div>
                <p className="mt-2 text-sm leading-6 text-foreground/75">{goNoGoRecommendation.detail}</p>
                <p className="mt-3 text-sm font-medium text-foreground">{goNoGoRecommendation.nextStep}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-foreground/50">
                  {goNoGoRecommendation.flags} flag(s) in current view
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-background/70 p-4 text-sm text-foreground/65">
              Operational view stays focused on action volume. Switch to compliance mode for a formal posture summary.
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <select
              value={sessionAgentFilter}
              onChange={(e) => setSessionAgentFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none"
            >
              {sessionAgentOptions.map((agent) => (
                <option key={agent} value={agent}>
                  {agent === 'all' ? 'All agents' : agent}
                </option>
              ))}
            </select>

            <select
              value={sessionSeverityFilter}
              onChange={(e) => setSessionSeverityFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none"
            >
              <option value="all">All severity</option>
              <option value="high">High severity</option>
              <option value="medium">Medium severity</option>
              <option value="low">Low severity</option>
            </select>

            <button
              type="button"
              onClick={exportSessionTrail}
              disabled={filteredSessionTrail.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground/80 transition hover:border-primary/25 hover:text-foreground"
            >
              <Download className="h-4 w-4" />
              Export JSON
            </button>
            <button
              type="button"
              onClick={exportSessionTrailCsv}
              disabled={filteredSessionTrail.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground/80 transition hover:border-primary/25 hover:text-foreground"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={exportComplianceBundle}
              disabled={filteredSessionTrail.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition hover:border-primary/35 hover:bg-primary/15"
            >
              <Download className="h-4 w-4" />
              Export bundle
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {filteredSessionTrail.length > 0 ? filteredSessionTrail.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-border bg-background/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">{entry.source}</p>
                    <h4 className="mt-1 text-sm font-semibold text-foreground">{entry.action}</h4>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-foreground/60">
                      {entry.target}
                    </span>
                    <span
                      className={[
                        'rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize',
                        getSessionSeverity(entry) === 'high'
                          ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
                          : getSessionSeverity(entry) === 'medium'
                            ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                            : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
                      ].join(' ')}
                    >
                      {getSessionSeverity(entry)}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-foreground/65">{entry.detail}</p>
                <p className="mt-3 text-xs text-foreground/45">{formatSessionTime(entry.timestamp)}</p>
              </article>
            )) : (
              <div className="rounded-2xl border border-dashed border-border bg-background/60 p-6 text-sm text-foreground/60 md:col-span-2 xl:col-span-4">
                No session actions match the current filters.
              </div>
            )}
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
                    <span className={`text-xs px-2 py-1 rounded capitalize ${actionColors[log.action as AuditAction]}`}>
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
                        View ({Object.keys(log.changes ?? {}).length})
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
