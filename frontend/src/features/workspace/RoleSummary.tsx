import { useAuth } from "@/features/auth/AuthContext";

/** Laconic line on the home page showing the user's active role, straight from the DB. */
export function RoleSummary() {
  const { user } = useAuth();
  const current = user?.current_role;
  if (!current) return null;

  return (
    <section className="px-4 sm:px-8">
      <p className="text-sm text-subtle">
        Роль: <span className="font-medium text-ink">{current.role.title}</span>
        {current.subdivision && ` · ${current.subdivision.title}`}
      </p>
    </section>
  );
}
