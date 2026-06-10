import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { ChatMessage, Session } from "@/types";

const STORAGE_KEY = "mol.sessions";

interface SessionsValue {
  sessions: Session[];
  activeId: string;
  active: Session;
  select: (id: string) => void;
  create: () => void;
  close: (id: string) => void;
  clear: (id: string) => void;
  append: (sessionId: string, message: ChatMessage) => void;
}

interface State {
  sessions: Session[];
  activeId: string;
}

type Action =
  | { type: "select"; id: string }
  | { type: "create" }
  | { type: "close"; id: string }
  | { type: "clear"; id: string }
  | { type: "append"; id: string; message: ChatMessage };

function createSession(index: number): Session {
  return { id: crypto.randomUUID(), index, messages: [] };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "select":
      return { ...state, activeId: action.id };
    case "create": {
      const index =
        state.sessions.reduce((max, s) => Math.max(max, s.index), 0) + 1;
      const session = createSession(index);
      return { sessions: [...state.sessions, session], activeId: session.id };
    }
    case "close": {
      if (state.sessions.length === 1) return state;
      const removedAt = state.sessions.findIndex((s) => s.id === action.id);
      const sessions = state.sessions.filter((s) => s.id !== action.id);
      const activeId =
        state.activeId === action.id
          ? (sessions[Math.max(0, removedAt - 1)] ?? sessions[0]).id
          : state.activeId;
      return { sessions, activeId };
    }
    case "clear":
      return {
        ...state,
        sessions: state.sessions.map((s) =>
          s.id === action.id ? { ...s, messages: [] } : s,
        ),
      };
    case "append":
      return {
        ...state,
        sessions: state.sessions.map((s) =>
          s.id === action.id
            ? { ...s, messages: [...s.messages, action.message] }
            : s,
        ),
      };
  }
}

function initState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as State;
      if (parsed.sessions?.length && parsed.activeId) return parsed;
    }
  } catch {
    /* ignore corrupted storage */
  }
  const session = createSession(1);
  return { sessions: [session], activeId: session.id };
}

const SessionsContext = createContext<SessionsValue | null>(null);

export function SessionsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, initState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota errors */
    }
  }, [state]);

  const value = useMemo<SessionsValue>(() => {
    const active =
      state.sessions.find((s) => s.id === state.activeId) ?? state.sessions[0];
    return {
      sessions: state.sessions,
      activeId: state.activeId,
      active,
      select: (id) => dispatch({ type: "select", id }),
      create: () => dispatch({ type: "create" }),
      close: (id) => dispatch({ type: "close", id }),
      clear: (id) => dispatch({ type: "clear", id }),
      append: (id, message) => dispatch({ type: "append", id, message }),
    };
  }, [state]);

  return <SessionsContext value={value}>{children}</SessionsContext>;
}

export function useSessions(): SessionsValue {
  const value = useContext(SessionsContext);
  if (!value)
    throw new Error("useSessions must be used within SessionsProvider");
  return value;
}
