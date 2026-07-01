import { createContext, useContext, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCurrentUser, logout as logoutRequest, setActiveRole } from "./api";
import type { AuthUser } from "./types";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasPermission: (entity: string, action: string) => boolean;
  refresh: () => Promise<unknown>;
  setRole: (configId: number) => Promise<void>;
  logout: () => Promise<void>;
  /** True while the farewell logout animation should be shown. */
  isLoggingOut: boolean;
  /** Called by the logout splash once its animation finishes. */
  endLogout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const query = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 5 * 60_000,
  });

  const user = query.data ?? null;
  const permissions = user?.current_role?.role.permissions ?? {};
  const refresh = () => queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });

  const value: AuthContextValue = {
    user,
    isLoading: query.isLoading,
    isAuthenticated: !query.isError && user != null,
    isAdmin: user?.is_admin ?? false,
    hasPermission: (entity, action) => (permissions[entity] ?? []).includes(action),
    refresh,
    setRole: async (configId) => {
      await setActiveRole(configId);
      await refresh();
    },
    logout: async () => {
      setIsLoggingOut(true);
      await logoutRequest().catch(() => undefined);
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      await refresh();
    },
    isLoggingOut,
    endLogout: () => setIsLoggingOut(false),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
