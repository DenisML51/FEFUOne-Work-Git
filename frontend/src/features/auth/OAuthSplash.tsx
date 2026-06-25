import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { YandexLogo } from "./YandexLogo";

type Phase = "hidden" | "show" | "closing";

function stripStatusParam() {
  const params = new URLSearchParams(window.location.search);
  params.delete("status_code");
  const query = params.toString();
  window.history.replaceState(
    {},
    "",
    window.location.pathname + (query ? `?${query}` : ""),
  );
}

/**
 * Shown right after returning from the Yandex OAuth redirect
 * (URL carries ?status_code=200): the Yandex logo blinks in a circle to
 * signal success, then the overlay fades out into the app.
 */
export function OAuthSplash() {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>(() =>
    new URLSearchParams(window.location.search).get("status_code") === "200"
      ? "show"
      : "hidden",
  );

  useEffect(() => {
    if (phase !== "show") return;
    // Remove the param so a refresh doesn't replay the splash.
    stripStatusParam();
    const toClosing = window.setTimeout(() => setPhase("closing"), 1500);
    const toHidden = window.setTimeout(() => setPhase("hidden"), 1900);
    return () => {
      window.clearTimeout(toClosing);
      window.clearTimeout(toHidden);
    };
    // Runs once: phase starts at "show" and only steps forward.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-canvas",
        phase === "closing" && "animate-fade-out",
      )}
    >
      <div className="relative flex size-24 items-center justify-center">
        <span className="absolute inset-0 animate-auth-ring rounded-full bg-[#fc3f1d]/20" />
        <span className="animate-pop flex size-24 items-center justify-center rounded-full bg-surface shadow-float">
          <YandexLogo className="size-12 animate-auth-blink" />
        </span>
      </div>
      <p className="animate-fade text-sm font-medium text-subtle">
        {t("auth.success")}
      </p>
    </div>
  );
}
