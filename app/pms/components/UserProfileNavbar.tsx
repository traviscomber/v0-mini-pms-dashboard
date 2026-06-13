'use client';

import { useEffect, useState } from 'react';
import { LogOut, User, Settings, Globe, Moon, Sun } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface UserData {
  email?: string;
  name?: string;
  propertyName?: string;
  role?: string;
}

export default function UserProfileNavbar() {
  const { language, setLanguage, theme, setTheme } = useLanguage();
  const [userData, setUserData] = useState<UserData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/viewer', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setUserData({
            email: data.email || 'user@property.com',
            name: data.name || 'User',
            propertyName: data.activeProperty?.name || 'Property',
            role: data.role || 'Admin',
          });
        }
      } catch (error) {
        console.error('[v0] Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch('/auth/signout', { method: 'POST', credentials: 'include' });
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('[v0] Logout error:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <div className="fixed top-0 right-0 h-16 px-6 py-3 flex items-center gap-4 border-b border-border bg-card z-50">
      {/* User Info Section */}
      <div className="hidden md:flex flex-col items-end gap-0.5">
        <div className="text-sm font-medium text-foreground">{userData.email}</div>
        <div className="text-xs text-foreground/60">{userData.propertyName}</div>
      </div>

      {/* User Avatar / Dropdown Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-background rounded-lg transition flex items-center justify-center w-10 h-10"
        title={userData.name || 'User'}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-foreground font-semibold">
          {(userData.email?.[0] || 'U').toUpperCase()}
        </div>
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-60">
            {/* User Info Header */}
            <div className="px-4 py-2 border-b border-border/50">
              <div className="text-sm font-medium text-foreground">{userData.name}</div>
              <div className="text-xs text-foreground/60">{userData.email}</div>
              <div className="text-xs text-foreground/50 mt-1">Role: {userData.role}</div>
            </div>

            {/* Actions */}
            <button className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-background transition text-foreground">
              <Settings className="w-4 h-4" />
              Settings
            </button>

            <div className="border-t border-border/50 my-1" />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-background transition text-foreground"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-background transition text-foreground"
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'Español' : 'English'}
            </button>

            <div className="border-t border-border/50 my-1" />

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-destructive/10 transition text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </button>

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
