import { useTranslation } from "react-i18next";
import { userName } from "@/data/workspace";

type Period = "morning" | "afternoon" | "evening" | "night";

function periodForHour(hour: number): Period {
  if (hour < 5) return "night";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export function Greeting() {
  const { t } = useTranslation();
  const period = periodForHour(new Date().getHours());

  return (
    <section className="px-4 py-12 sm:px-8 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {t(`greeting.${period}`, { name: userName })}
      </h1>
      <p className="mt-3 max-w-xl text-base text-subtle">
        {t("greeting.subtitle")}
      </p>
    </section>
  );
}
