import { createServerFn } from "@tanstack/react-start";

export type McStatus = {
  ok: boolean;
  online: boolean;
  playersOnline: number | null;
  playersMax: number | null;
  version: string | null;
  motd: string | null;
  latencyMs: number | null;
  hostname: string;
  checkedAt: string;
  error: string | null;
};

/**
 * Live Minecraft server status. Never fabricates data: when the upstream check
 * fails we return ok:false so the UI can say "status unavailable".
 */
export const getMinecraftStatus = createServerFn({ method: "GET" })
  .inputValidator((data: { host: string; port?: string; bedrock?: boolean }) => ({
    host: String(data.host ?? "").trim().slice(0, 200),
    port: data.port ? String(data.port).trim().slice(0, 6) : "",
    bedrock: Boolean(data.bedrock),
  }))
  .handler(async ({ data }): Promise<McStatus> => {
    const address = data.port ? `${data.host}:${data.port}` : data.host;
    const base = data.bedrock
      ? "https://api.mcsrvstat.us/bedrock/3/"
      : "https://api.mcsrvstat.us/3/";

    const empty: McStatus = {
      ok: false,
      online: false,
      playersOnline: null,
      playersMax: null,
      version: null,
      motd: null,
      latencyMs: null,
      hostname: address,
      checkedAt: new Date().toISOString(),
      error: null,
    };

    if (!data.host) return { ...empty, error: "No server address configured" };

    const started = Date.now();
    try {
      const res = await fetch(base + encodeURIComponent(address), {
        headers: { accept: "application/json", "user-agent": "VeylSMP-Website" },
        signal: AbortSignal.timeout(9000),
      });
      const latencyMs = Date.now() - started;
      if (!res.ok) {
        return { ...empty, latencyMs, error: `Status service returned ${res.status}` };
      }
      const json = (await res.json()) as {
        online?: boolean;
        players?: { online?: number; max?: number };
        version?: string;
        motd?: { clean?: string[] };
        debug?: { ping?: boolean };
      };

      return {
        ok: true,
        online: Boolean(json.online),
        playersOnline: typeof json.players?.online === "number" ? json.players.online : null,
        playersMax: typeof json.players?.max === "number" ? json.players.max : null,
        version: json.version ?? null,
        motd: json.motd?.clean?.filter(Boolean).join(" ") || null,
        latencyMs,
        hostname: address,
        checkedAt: new Date().toISOString(),
        error: null,
      };
    } catch {
      return {
        ...empty,
        latencyMs: Date.now() - started,
        error: "Server status unavailable",
      };
    }
  });
