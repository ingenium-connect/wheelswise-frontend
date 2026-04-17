"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserProfile } from "@/types/data";
import { USER_ID, EMAIL, NAME } from "@/utilities/constants";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: UserProfile) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (userData: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider - Centralized authentication state management
 *
 * This provider:
 * - Manages auth state (user, isAuthenticated, isLoading)
 * - Checks auth status on mount by reading non-sensitive cookies
 * - Provides login/logout methods
 * - Syncs auth state across tabs via storage events
 * - Handles auth state changes via custom events
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = user !== null;

  /**
   * Check authentication status by asking the server whether the httpOnly
   * access-token cookie is present. Falls back to clearing auth state on any
   * error so the UI never shows authenticated controls to a logged-out user.
   */
  const checkAuth = useCallback(async () => {
    try {
      // The httpOnly __server_token__ cookie is invisible to document.cookie,
      // so we ask a lightweight server route that can read it.
      const res = await fetch("/api/auth/check", { credentials: "include" });
      const { authenticated } = await res.json();

      if (authenticated) {
        // Token is valid — read the non-sensitive identity cookies for display
        const cookieMap = document.cookie.split("; ").reduce(
          (acc, cookie) => {
            const [key, ...rest] = cookie.split("=");
            acc[key] = rest.join("=");
            return acc;
          },
          {} as Record<string, string>,
        );

        const userId = cookieMap[USER_ID];
        const name = cookieMap[NAME];
        const email = cookieMap[EMAIL];

        if (userId && name) {
          setUser({
            id: userId,
            name: decodeURIComponent(name),
            email: email ? decodeURIComponent(email) : "",
            msisdn: "",
            id_number: "",
            kra_pin: "",
            is_active: true,
            user_type: "CUSTOMER",
          });
        } else {
          // Token present but identity cookies missing — treat as unauthenticated
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("[AuthContext] Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login - Update auth state with user data
   * Note: The actual cookie setting happens in the API route
   */
  const login = useCallback((userData: UserProfile) => {
    setUser(userData);
    setIsLoading(false); // Immediately set loading to false since we have user data
    // Store flag in sessionStorage to skip auth check after navigation
    sessionStorage.setItem("just_logged_in", "true");
    // Dispatch event so other components can react
    window.dispatchEvent(new Event("auth:changed"));
  }, []);

  /**
   * Logout - Clear auth state and redirect
   */
  const logout = useCallback(async () => {
    try {
      // Clear user state immediately
      setUser(null);

      // Clear client-side cookies immediately (belt-and-suspenders approach)
      const cookiesToClear = [USER_ID, EMAIL, NAME];
      cookiesToClear.forEach((cookieName) => {
        document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      });

      // Dispatch event so other components can react
      window.dispatchEvent(new Event("auth:changed"));

      // Call logout API (POST) which clears httpOnly cookies
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      // Navigate to login. No router.refresh() here — it triggers a full
      // server re-render that blanks the page mid-transition. setUser(null)
      // above already updated the nav; push() handles the page change.
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Force redirect via GET endpoint if POST fails
      window.location.href = "/api/logout";
    }
  }, [router]);

  /**
   * Update user data in state
   */
  const updateUser = useCallback((userData: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  }, []);

  // Check auth on mount
  useEffect(() => {
    // Check if we just logged in (flag set in login function)
    const justLoggedIn = sessionStorage.getItem("just_logged_in");

    if (justLoggedIn) {
      // Clear the flag and skip auth check since login() already set user data
      sessionStorage.removeItem("just_logged_in");
      setIsLoading(false);
    } else {
      // Normal auth check
      checkAuth();
    }
  }, [checkAuth]);

  // Re-check auth when page becomes visible (e.g., after switching tabs)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAuth();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkAuth]);

  // Re-check auth when user navigates (catches logout redirects)
  useEffect(() => {
    const handleFocus = () => {
      checkAuth();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkAuth]);

  // Check auth on route change (catches logout redirects and navigation)
  useEffect(() => {
    // Only check if we're on login page (might have been redirected after logout)
    if (pathname === "/login") {
      checkAuth();
    }
  }, [pathname, checkAuth]);

  // Listen for auth changes (login/logout in same tab)
  useEffect(() => {
    const handleAuthChange = () => {
      // Only check auth if we don't already have user data
      // (avoid unnecessary fetch after login)
      if (!user) {
        checkAuth();
      }
    };

    window.addEventListener("auth:changed", handleAuthChange);
    return () => {
      window.removeEventListener("auth:changed", handleAuthChange);
    };
  }, [checkAuth, user]);

  // Sync auth state across tabs using storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // If the clear_client_state flag is set, it means logout happened in another tab
      if (e.key === "auth_event" && e.newValue === "logout") {
        setUser(null);
        router.push("/");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [router]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth hook - Access auth context
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
