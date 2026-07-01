import { useAuth } from "@/features/auth/AuthContext";
import { firstNameOf } from "@/features/auth/name";

type Period = "morning" | "afternoon" | "evening" | "night";

function periodForHour(hour: number): Period {
  if (hour < 5) return "night";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

function greetingFor(period: Period, name: string): string {
  switch (period) {
    case "morning":
      return `Доброе утро, ${name}`;
    case "afternoon":
      return `Добрый день, ${name}`;
    case "evening":
      return `Добрый вечер, ${name}`;
    case "night":
      return `Доброй ночи, ${name}`;
  }
}

export function Greeting() {
  const { user } = useAuth();
  const period = periodForHour(new Date().getHours());
  const fullName = user?.full_name ?? "";

  return (
    <section className="px-4 py-12 sm:px-8 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {greetingFor(period, firstNameOf(fullName))}
      </h1>
      {fullName && (
        <p className="mt-2 text-base font-medium text-subtle">{fullName}</p>
      )}
      <p className="mt-3 max-w-xl text-base text-subtle">
        Краткая сводка по материальным ценностям и операциям.
      </p>
    </section>
  );
}
