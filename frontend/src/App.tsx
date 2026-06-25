import { AuthProvider } from "@/features/auth/AuthContext";
import { AuthGate } from "@/features/auth/AuthGate";
import { OAuthSplash } from "@/features/auth/OAuthSplash";
import { NavProvider } from "@/features/navigation/NavContext";
import { SessionsProvider } from "@/features/sessions/SessionsContext";
import { UploadsProvider } from "@/features/uploads/UploadsContext";
import { AppShell } from "@/features/layout/AppShell";

export function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <NavProvider>
          <SessionsProvider>
            <UploadsProvider>
              <AppShell />
            </UploadsProvider>
          </SessionsProvider>
        </NavProvider>
      </AuthGate>
      <OAuthSplash />
    </AuthProvider>
  );
}
