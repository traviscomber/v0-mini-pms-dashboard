/**
 * Dark theme utilities for brand consistency
 * Maps light theme colors to dark theme design tokens
 */

export const darkThemeColors = {
  // Container backgrounds
  container: 'bg-card',
  containerAlt: 'bg-card/50',
  containerDark: 'bg-background',
  
  // Text colors
  textPrimary: 'text-foreground',
  textSecondary: 'text-foreground/80',
  textTertiary: 'text-foreground/60',
  textMuted: 'text-foreground/50',
  
  // Borders
  border: 'border-border',
  
  // Status badges (with dark theme colors)
  badgeSuccess: 'bg-green-500/20 text-green-300',
  badgeWarning: 'bg-orange-500/20 text-orange-300',
  badgeError: 'bg-red-500/20 text-red-300',
  badgeInfo: 'bg-blue-500/20 text-blue-300',
  
  // Button colors
  buttonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  buttonSecondary: 'bg-card border-border hover:bg-card/80',
  buttonGhost: 'hover:bg-card',
  buttonDanger: 'text-red-400 hover:text-red-300',
};

/**
 * Converts old light theme color names to dark theme tokens
 */
export function convertToTheme(lightColorClass: string): string {
  const mapping: Record<string, string> = {
    // Backgrounds
    'bg-white': 'bg-card',
    'bg-slate-50': 'bg-card/50',
    'bg-slate-100': 'bg-card/70',
    'bg-gray-50': 'bg-card/50',
    'bg-gray-100': 'bg-card/70',
    
    // Text
    'text-slate-900': 'text-foreground',
    'text-slate-800': 'text-foreground/90',
    'text-slate-700': 'text-foreground/80',
    'text-slate-600': 'text-foreground/70',
    'text-slate-500': 'text-foreground/60',
    'text-black': 'text-foreground',
    'text-gray-900': 'text-foreground',
    
    // Borders
    'border-slate-200': 'border-border',
    'border-gray-200': 'border-border',
    'border-slate-300': 'border-border',
  };
  
  return mapping[lightColorClass] || lightColorClass;
}
