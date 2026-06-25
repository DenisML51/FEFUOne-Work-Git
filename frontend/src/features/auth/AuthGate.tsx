import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { LoginPage } from "./LoginPage";

export function AuthGate({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-canvas">
        <div className="size-8 animate-spin rounded-full border-2 border-line border-t-ink" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
}
