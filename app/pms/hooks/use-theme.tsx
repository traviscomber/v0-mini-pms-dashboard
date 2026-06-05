'use client';

import { useEffect, useState } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage for saved theme preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      setIsDark(saved === 'dark');
      document.documentElement.classList.toggle('dark', saved === 'dark');
      document.documentElement.classList.toggle('light', saved === 'light');
    } else {
      // Default to dark mode
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    // Update DOM
    document.documentElement.classList.toggle('dark', newIsDark);
    document.documentElement.classList.toggle('light', !newIsDark);

    // Save preference
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  // Return safe values before hydration
  if (!mounted) {
    return { isDark: true, toggleTheme: () => {} };
  }

  return { isDark, toggleTheme };
}
