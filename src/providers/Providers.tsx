'use client';

import { AuthProvider } from '@/context/AuthContext';

/**
 * Root Providers Component
 * Wraps all context providers for the application
 * Add additional providers here as needed
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
