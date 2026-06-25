import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { loginWithYandex } from "./api";
import { YandexLogo } from "./YandexLogo";

export function YandexLoginButton({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [leaving, setLeaving] = useState(false);

  function handleClick() {
    if (leaving) return;
    setLeaving(true);
    // Let the morph animation play before the full-page redirect to Yandex.
    window.setTimeout(loginWithYandex, 650);
  }

  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={handleClick}
        disabled={leaving}
        aria-busy={leaving}
        aria-label={t("auth.yandexButton")}
        className={cn(
          "relative inline-flex h-12 items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-2xl bg-black px-5 text-sm font-medium text-white transition-[width,border-radius,padding] duration-300 ease-out hover:bg-black/90 disabled:cursor-default",
          leaving ? "w-12 rounded-full px-0" : "w-full",
          className,
        )}
      >
        {leaving ? (
          <span className="relative flex size-7 items-center justify-center">
            <span className="absolute inset-0 animate-spin rounded-full border-2 border-white/25 border-t-white" />
            <YandexLogo className="size-4" />
          </span>
        ) : (
          <>
            <YandexLogo className="size-5" />
            <span>{t("auth.yandexButton")}</span>
          </>
        )}
      </button>
    </div>
  );
}
