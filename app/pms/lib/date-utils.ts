export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getDaysUntil(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  const diff = d.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getNightsBetween(checkIn: Date | string, checkOut: Date | string): number {
  const ci = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
  const co = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;
  const diff = co.getTime() - ci.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
