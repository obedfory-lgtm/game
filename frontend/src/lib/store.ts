import { create } from "zustand";
import { api, setApiToken, AuthUser } from "./api";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  guest: () => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post<{ token: string; user: AuthUser }>("/auth/login", { email, password });
      setApiToken(res.token);
      set({ user: res.user, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },

  signup: async (email, password, displayName) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post<{ token: string; user: AuthUser }>("/auth/signup", { email, password, displayName });
      setApiToken(res.token);
      set({ user: res.user, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },

  guest: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.post<{ token: string; user: AuthUser }>("/auth/guest");
      setApiToken(res.token);
      set({ user: res.user, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },

  logout: async () => {
    try { await api.post("/auth/logout"); } catch {}
    setApiToken(null);
    set({ user: null });
  },

  fetchMe: async () => {
    set({ loading: true });
    try {
      const user = await api.get<AuthUser>("/me");
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
}));

interface ToastState {
  toasts: { id: number; msg: string; kind?: "info" | "error" | "success" }[];
  push: (msg: string, kind?: "info" | "error" | "success") => void;
  dismiss: (id: number) => void;
}

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  push: (msg, kind = "info") =>
    set((s) => ({ toasts: [...s.toasts, { id: Date.now() + Math.random(), msg, kind }] })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

interface UiState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUi = create<UiState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));