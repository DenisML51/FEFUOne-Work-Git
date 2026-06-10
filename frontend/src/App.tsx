import { NavProvider } from "@/features/navigation/NavContext";
import { SessionsProvider } from "@/features/sessions/SessionsContext";
import { UploadsProvider } from "@/features/uploads/UploadsContext";
import { AppShell } from "@/features/layout/AppShell";

export function App() {
  return (
    <NavProvider>
      <SessionsProvider>
        <UploadsProvider>
          <AppShell />
        </UploadsProvider>
      </SessionsProvider>
    </NavProvider>
  );
}
