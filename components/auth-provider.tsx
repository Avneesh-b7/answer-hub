// AuthProvider - handles session hydration and persistence on app startup
// Checks if user has a valid session when app loads
// Industry-standard pattern for auth state management

"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/src/stores/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { hydrateAuth, isHydrated, session } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hydrate auth state on app load
    const initAuth = async () => {
      // Skip hydration if already hydrated or if we have a session from persist
      if (!isHydrated && !session) {
        await hydrateAuth();
      }
      setIsLoading(false);
    };

    initAuth();
  }, [hydrateAuth, isHydrated, session]);

  // Optional: Show loading state while checking session
  // You can customize this or remove it for instant render
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
