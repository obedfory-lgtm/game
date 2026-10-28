import { Client, Room } from "@colyseus/sdk";
import { getApiToken } from "./api";

let client: Client | null = null;
let room: Room | null = null;

export function getColyseusClient(): Client {
  if (client) return client;
  const wsUrl =
    (typeof window !== "undefined" &&
      (process.env.NEXT_PUBLIC_WS_URL as string)) ||
    (typeof window !== "undefined" ? "ws://localhost:2567" : "ws://localhost:2567");
  client = new Client(wsUrl);
  return client;
}

export async function joinWorld(worldId: string): Promise<Room> {
  const c = getColyseusClient();
  const token = getApiToken();
  const r = await c.joinOrCreate("world_room", {
    worldId,
    token,
  });
  room = r;
  return r;
}

export async function joinPrivateWorld(worldId: string, inviteToken: string): Promise<Room> {
  const c = getColyseusClient();
  const r = await c.joinOrCreate("world_room", {
    worldId,
    token: getApiToken(),
    inviteToken,
  });
  room = r;
  return r;
}

export function getCurrentRoom(): Room | null {
  return room;
}

export function leaveWorld() {
  if (room) {
    try { room.leave(); } catch {}
    room = null;
  }
}

export function sendWorldMessage(type: string, payload: any) {
  if (room) room.send(type, payload);
}

export function onWorldMessage(type: string, handler: (payload: any) => void) {
  if (!room) return () => {};
  const fn = (payload: any) => handler(payload);
  (room as any).onMessage(type, fn);
  return () => (room as any).messageHandlers?.delete?.(type);
}