import { RequireAuth } from "@/components/auth/RequireAuth";
import { AuthErrorBoundary } from "@/components/auth/AuthErrorBoundary";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ReactNode } from "react";

/**
 * Dashboard Layout - Wraps all dashboard pages with auth guard and error boundaries
 * Ensures users cannot access dashboard without authentication
 * Catches and handles errors gracefully
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthErrorBoundary>
        <RequireAuth>{children}</RequireAuth>
      </AuthErrorBoundary>
    </ErrorBoundary>
  );
}
