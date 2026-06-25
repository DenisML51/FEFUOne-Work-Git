import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, Boxes } from "lucide-react";
import { YandexLoginButton } from "./YandexLoginButton";

export function LoginPage() {
  const { t } = useTranslation();
  const [error, setError] = useState("");

  // Surface an error if Yandex bounced us back with a non-success code.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("status_code");
    if (!code) return;
    if (code !== "200") setError(t("auth.oauthError"));
    params.delete("status_code");
    const query = params.toString();
    window.history.replaceState(
      {},
      "",
      window.location.pathname + (query ? `?${query}` : ""),
    );
  }, [t]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-canvas px-4">
      {/* soft brand glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 size-[460px] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-3xl border border-line bg-surface p-8 text-center shadow-card sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-orange text-white shadow-card">
          <Boxes size={26} />
        </div>

        <h1 className="mt-5 text-2xl font-semibold tracking-tight">
          {t("auth.brand")}
        </h1>
        <p className="mt-2 text-sm text-subtle">{t("auth.subtitle")}</p>

        {error && (
          <div className="mt-6 flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/5 px-3 py-2.5 text-left text-sm text-danger">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-8">
          <YandexLoginButton />
        </div>

        <p className="mt-6 text-xs text-faint">{t("auth.footer")}</p>
      </div>
    </div>
  );
}
