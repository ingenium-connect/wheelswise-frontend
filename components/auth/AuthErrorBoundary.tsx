"use client";

import React, { Component, ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthErrorBoundaryProps {
  children: ReactNode;
}

interface AuthErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * AuthErrorBoundary - Catches authentication-related errors
 *
 * Specifically handles auth errors and redirects to login page.
 * Use this to wrap authenticated sections of the app.
 *
 * Usage:
 * ```tsx
 * <AuthErrorBoundary>
 *   <DashboardContent />
 * </AuthErrorBoundary>
 * ```
 */
export class AuthErrorBoundary extends Component<
  AuthErrorBoundaryProps,
  AuthErrorBoundaryState
> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[AuthErrorBoundary] Caught auth error:", error, errorInfo);

    // Check if it's an auth-related error
    const isAuthError =
      error.message?.toLowerCase().includes("unauthorized") ||
      error.message?.toLowerCase().includes("authentication") ||
      error.message?.toLowerCase().includes("token");

    if (isAuthError) {
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = "/api/logout";
      }, 2000);
    }
  }

  handleLogin = () => {
    window.location.href = "/login";
  };

  render() {
    if (this.state.hasError) {
      const isAuthError =
        this.state.error?.message?.toLowerCase().includes("unauthorized") ||
        this.state.error?.message?.toLowerCase().includes("authentication") ||
        this.state.error?.message?.toLowerCase().includes("token");

      return (
        <div className="flex items-center justify-center min-h-[400px] px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-50 rounded-lg shrink-0">
                  <ShieldAlert className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {isAuthError
                      ? "Authentication Required"
                      : "Access Error"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {isAuthError
                      ? "Your session has expired or is invalid. Please log in again to continue."
                      : "We encountered an error accessing this content. Please try logging in again."}
                  </p>
                  <Button onClick={this.handleLogin} size="sm">
                    Log In
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
