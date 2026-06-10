import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SectionId } from "@/types";

interface NavValue {
  active: SectionId;
  navigate: (section: SectionId) => void;
}

const NavContext = createContext<NavValue | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<SectionId>("overview");
  const value = useMemo<NavValue>(
    () => ({ active, navigate: setActive }),
    [active],
  );
  return <NavContext value={value}>{children}</NavContext>;
}

export function useNav(): NavValue {
  const value = useContext(NavContext);
  if (!value) throw new Error("useNav must be used within NavProvider");
  return value;
}
