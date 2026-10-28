"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { World } from "@/lib/api";
import { useToast } from "@/lib/store";

const THEMES = ["All", "Fantasy", "Sci-Fi", "Horror", "Comedy", "City", "Desert", "Forest", "Dungeon"];

export default function WorldsPage() {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("All");
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<{ worlds: World[] }>("/worlds");
        setWorlds(res.worlds);
      } catch (e: any) {
        toast.push(e.message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const filtered = worlds.filter((w) => {
    const q = query.trim().toLowerCase();
    const matchQ = !q || w.name.toLowerCase().includes(q) || (w.description || "").toLowerCase().includes(q);
    const matchT = theme === "All" || w.theme === theme;
    return matchQ && matchT && w.visibility === "public";
  });

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">World Browser</h1>
          <p className="text-sm muted">Explore public worlds, or create your own.</p>
        </div>
        <Link href="/worlds/new" className="primary">+ New world</Link>
      </div>

      <div className="card p-4 mb-6 flex flex-wrap gap-3 items-center">
        <input
          className="field flex-1 min-w-[200px]"
          placeholder="Search worlds…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="field" value={theme} onChange={(e) => setTheme(e.target.value)}>
          {THEMES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-4">
              <div className="skel h-40 mb-3" />
              <div className="skel h-4 w-2/3 mb-2" />
              <div className="skel h-3 w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-lg font-semibold mb-2">No worlds found</div>
          <p className="text-sm muted mb-4">
            There are no public worlds matching your filters yet. Be the first to create one.
          </p>
          <Link href="/worlds/new" className="primary">Create a world</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((w) => (
            <Link key={w.id} href={`/worlds/${w.id}`} className="card overflow-hidden hover:border-[var(--accent)] transition">
              <div className="h-40 bg-[var(--bg)] grid place-items-center text-5xl">
                {themeEmoji(w.theme)}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold truncate">{w.name}</div>
                  <span className="text-xs px-2 py-0.5 rounded bg-[var(--panel-2)] text-[var(--accent-2)]">{w.onlineCount} online</span>
                </div>
                <div className="text-xs muted mt-0.5">by {w.owner.displayName} · {w.theme}</div>
                <p className="text-sm mt-2 line-clamp-2 muted">{w.description || "No description."}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

function themeEmoji(t: string) {
  const map: Record<string, string> = {
    Fantasy: "⚔️", "Sci-Fi": "🚀", Horror: "👻", Comedy: "😄", City: "🏙️",
    Desert: "🏜️", Forest: "🌲", Dungeon: " dungeon",
  };
  return map[t] || "🗺️";
}