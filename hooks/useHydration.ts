import { useEffect, useState } from "react";

/**
 * useHydration hook
 *
 * Prevents hydration mismatches when reading from localStorage or other
 * client-only APIs that aren't available during SSR.
 *
 * Returns true once the component has hydrated on the client.
 *
 * Usage:
 * ```tsx
 * const hydrated = useHydration();
 * if (!hydrated) return null; // or return skeleton
 * // Now safe to read from localStorage, etc.
 * ```
 */
export function useHydration(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
