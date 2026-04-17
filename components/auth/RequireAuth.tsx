"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface RequireAuthProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * RequireAuth - Client-side auth guard component
 *
 * Wraps protected content and ensures user is authenticated.
 * Shows loading spinner while checking auth status.
 * Redirects to login if not authenticated.
 *
 * Usage:
 * ```tsx
 * <RequireAuth>
 *   <ProtectedContent />
 * </RequireAuth>
 * ```
 */
export function RequireAuth({ children, redirectTo }: RequireAuthProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const loginUrl = redirectTo ? `/login?redirect=${redirectTo}` : "/login";
      router.push(loginUrl);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
