/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 */

export const a11y = {
  // Keyboard handler for modal/drawer closing
  handleEscapeKey: (callback: () => void) => (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      callback();
    }
  },

  // Get accessible role and aria labels
  button: {
    role: 'button',
    tabIndex: 0,
  },

  dialog: {
    role: 'dialog',
    'aria-modal': true,
  },

  // Screen reader only text
  srOnly: 'sr-only',

  // Live region for alerts
  liveRegion: {
    'aria-live': 'polite',
    'aria-atomic': true,
  },

  // Status indicators
  statusBadge: {
    paid: {
      role: 'status',
      'aria-label': 'Payment received - Paid',
      className: 'bg-green-500',
    },
    partial: {
      role: 'status',
      'aria-label': 'Partial payment received',
      className: 'bg-yellow-500',
    },
    pending: {
      role: 'status',
      'aria-label': 'Payment pending',
      className: 'bg-orange-500',
    },
    overdue: {
      role: 'status',
      'aria-label': 'Payment overdue',
      className: 'bg-red-500',
    },
  },
};

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

// Memoization cache for expensive calculations
export class MemoCache<T> {
  private cache: Map<string, T> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: string): T | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: T): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Performance: Intersection observer for lazy loading
export function useIntersectionObserver(callback: (isVisible: boolean) => void) {
  return (element: HTMLElement | null) => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        callback(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  };
}

// Get color contrast ratio (accessibility)
export function getContrastRatio(rgb1: string, rgb2: string): number {
  const getLuminance = (rgb: string) => {
    const [r, g, b] = rgb.match(/\d+/g)!.map(x => parseInt(x) / 255);
    const [rs, gs, bs] = [r, g, b].map(c =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}
