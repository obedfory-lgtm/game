import Link from "next/link";
import { useAuth } from "@/lib/store";
import { useEffect } from "react";
import { useToast } from "@/lib/store";

export default function HomePage() {
  const { user, loading, fetchMe } = useAuth();
  const toast = useToast();

  useEffect(() => {
    fetchMe().catch(() => {});
  }, [fetchMe]);

  return (
    <main className="min-h-screen flex flex-col">
      <nav className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="inline-block w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] grid place-items-center text-sm">R</span>
            REALMS
          </Link>
          <div className="flex items-center gap-2">
            {loading ? (
              <span className="text-sm muted">…</span>
            ) : user ? (
              <>
                <Link href="/worlds" className="text-sm muted hover:text-[var(--text)]">Worlds</Link>
                <Link href="/me" className="text-sm muted hover:text-[var(--text)]">Profile</Link>
                <button onClick={() => useAuth().logout().then(() => toast.push("Logged out", "success"))}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm muted hover:text-[var(--text)]">Sign in</Link>
                <Link href="/signup" className="text-sm">Get started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--panel)] mb-6">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-2)]" /> Persistent · Multiplayer · World-building
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl">
          Create worlds. Live in them.
        </h1>
        <p className="mt-5 text-lg text-[var(--muted)] max-w-2xl">
          REALMS is a browser-based 2D multiplayer social world. Build your own map with a tile editor,
          place NPCs and quests, invite friends, and watch your world persist — with or without you online.
        </p>
        <div className="mt-10 flex gap-3 flex-wrap justify-center">
          <Link href={user ? "/worlds" : "/signup"} className="primary">Start building</Link>
          <Link href="/worlds" className="ghost">Explore worlds</Link>
        </div>

        <div className="mt-16 grid sm:grid-cols-3 gap-4 max-w-4xl text-left">
          {[
            ["Tile + object editor", "Paint terrain, place doors, portals, NPCs, spawn points. Publish or keep private."],
            ["Live multiplayer", "Real-time movement, chat, presence. Server-authoritative positions and collision."],
            ["Persistent lore", "Quests, NPC dialogue, world history, and player progress survive sessions."],
          ].map(([t, d]) => (
            <div key={t} className="card p-5">
              <div className="text-[var(--accent-2)] font-semibold mb-1">{t}</div>
              <div className="text-sm muted">{d}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--border)] py-6 text-center text-sm muted">
        Built with Next.js, Colyseus, and PostgreSQL.
      </footer>
    </main>
  );
}