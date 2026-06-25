import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth/AuthContext";
import { firstNameOf } from "@/features/auth/name";

type Period = "morning" | "afternoon" | "evening" | "night";

function periodForHour(hour: number): Period {
  if (hour < 5) return "night";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export function Greeting() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const period = periodForHour(new Date().getHours());
  const fullName = user?.full_name ?? "";

  return (
    <section className="px-4 py-12 sm:px-8 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {t(`greeting.${period}`, { name: firstNameOf(fullName) })}
      </h1>
      {fullName && (
        <p className="mt-2 text-base font-medium text-subtle">{fullName}</p>
      )}
      <p className="mt-3 max-w-xl text-base text-subtle">
        {t("greeting.subtitle")}
      </p>
    </section>
  );
}
