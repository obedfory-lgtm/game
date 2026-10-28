const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL as string) || "/api"
    : (process.env.API_BASE_URL as string) || "http://localhost:3001";

export const WS_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_WS_URL as string) || "ws://localhost:2567"
    : (process.env.WS_URL as string) || "ws://localhost:2567";

let token: string | null = null;

export function setApiToken(t: string | null) {
  token = t;
  if (typeof window !== "undefined") {
    if (t) localStorage.setItem("realms_token", t);
    else localStorage.removeItem("realms_token");
  }
}

export function getApiToken() {
  if (token) return token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("realms_token");
  }
  return token;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  const t = getApiToken();
  if (t) headers["Authorization"] = `Bearer ${t}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any)?.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: any) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: any) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: any) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export type AuthUser = {
  id: string;
  displayName: string;
  avatar?: any;
  createdAt?: string;
};

export type World = {
  id: string;
  name: string;
  description: string | null;
  theme: string;
  visibility: "public" | "private";
  owner: { id: string; displayName: string };
  occupantCount: number;
  onlineCount: number;
  createdAt: string;
  publishedAt: string | null;
  tilemap?: any;
};

export type Friend = {
  id: string;
  displayName: string;
  avatar?: any;
  online?: boolean;
  lastSeen?: string | null;
};

export type Quest = {
  id: string;
  worldId: string;
  title: string;
  description: string;
  objective: string;
  reward: number;
  progress: number;
  target: number;
  status: "active" | "completed";
};

export type LoreEntry = {
  id: string;
  worldId: string;
  title: string;
  body: string;
  type: "event" | "lore" | "note";
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  worldId: string;
  userId: string;
  displayName: string;
  avatar?: any;
  body: string;
  createdAt: string;
};

export type Notification = {
  id: string;
  type: "friend" | "quest" | "system";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type WorldEditorData = {
  id: string;
  name: string;
  description: string | null;
  theme: string;
  visibility: "public" | "private";
  tilemap: any;
  objects: any[];
  spawnPoints: any[];
  npcs: any[];
};