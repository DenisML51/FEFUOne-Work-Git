/** Russian full names are "Фамилия Имя Отчество" — the given name is the 2nd token. */
export function firstNameOf(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts[1] ?? parts[0] ?? "";
}

export function initialsOf(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const value =
    parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
  return value.toUpperCase();
}
