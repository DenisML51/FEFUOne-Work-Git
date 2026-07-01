import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useAuth } from "./AuthContext";
import { FefuOneLogo } from "./FefuOneLogo";

type Phase = "hidden" | "show" | "closing";

/**
 * Farewell splash shown while the account session is being closed. Mirrors the
 * login `OAuthSplash` so entering and leaving the app feel symmetric.
 */
export function LogoutSplash() {
  const { isLoggingOut, endLogout } = useAuth();
  const [phase, setPhase] = useState<Phase>("hidden");

  useEffect(() => {
    if (!isLoggingOut) return;
    setPhase("show");
    const toClosing = window.setTimeout(() => setPhase("closing"), 1400);
    const toHidden = window.setTimeout(() => {
      setPhase("hidden");
      endLogout();
    }, 1800);
    return () => {
      window.clearTimeout(toClosing);
      window.clearTimeout(toHidden);
    };
  }, [isLoggingOut, endLogout]);

  if (phase === "hidden") return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-canvas",
        phase === "closing" && "animate-fade-out",
      )}
    >
      <div className="relative flex size-24 items-center justify-center">
        <span className="animate-auth-ring absolute inset-0 rounded-full bg-brand/15" />
        <span className="animate-pop flex size-24 items-center justify-center rounded-full bg-surface shadow-float">
          <FefuOneLogo className="animate-auth-blink size-11 text-brand" />
        </span>
      </div>
      <p className="animate-fade text-sm font-medium text-subtle">
        Выход из аккаунта…
      </p>
    </div>
  );
}
