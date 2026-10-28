"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useToast } from "@/lib/store";

export default function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { login, signup, guest, loading, error, clearError } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "login") await login(email, password);
      else await signup(email, password, displayName);
      router.push("/worlds");
    } catch {}
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1">{mode === "login" ? "Welcome back" : "Create account"}</h1>
        <p className="text-sm muted mb-6">
          {mode === "login" ? "Sign in to your realms." : "Start creating persistent worlds."}
        </p>

        <form onSubmit={submit} className="flex flex-col gap-3">
          {mode === "signup" && (
            <input
              className="field"
              placeholder="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              minLength={2}
            />
          )}
          <input
            className="field"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {error && <div className="error-text">{error}</div>}
          <button type="submit" className="primary" disabled={loading}>
            {loading ? "…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="muted">or</span>
          <button
            className="ghost"
            disabled={loading}
            onClick={async () => {
              try {
                await guest();
                toast.push("Playing as guest", "success");
                router.push("/worlds");
              } catch (e: any) {
                toast.push(e.message, "error");
              }
            }}
          >
            Play as guest
          </button>
        </div>

        <p className="mt-6 text-sm muted">
          {mode === "login" ? "No account?" : "Already have one?"}{" "}
          <Link href={mode === "login" ? "/signup" : "/login"}>{mode === "login" ? "Sign up" : "Sign in"}</Link>
        </p>
      </div>
    </main>
  );
}