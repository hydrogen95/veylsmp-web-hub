import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Activity, Gauge, Signal, Users } from "lucide-react";
import { statusQuery } from "@/lib/site";
import type { ServerSettings } from "@/lib/content.functions";

export function StatusCard({ server }: { server: ServerSettings | null }) {
  const host = server?.status_host || server?.java_ip || "";
  const port = server?.status_port || server?.java_port || "";
  const bedrock = Boolean(server?.check_bedrock && !server?.check_java);
  const { data, isPending } = useQuery(
    statusQuery(host, port, server?.refresh_interval ?? 45, bedrock),
  );

  const unavailable = !isPending && (!data || !data.ok);
  const online = Boolean(data?.ok && data.online);
  const maxPlayers = data?.playersMax ?? server?.max_players ?? 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="glass-card glow-hover p-6 md:p-8"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">
            SERVER STATUS
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="relative flex size-3.5">
              {online && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-success"
                  animate={{ scale: [1, 2.1, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <span
                className={`relative size-3.5 rounded-full ${
                  isPending
                    ? "bg-muted-foreground"
                    : online
                      ? "bg-success"
                      : unavailable
                        ? "bg-muted-foreground"
                        : "bg-destructive"
                }`}
              />
            </span>
            <h3 className="font-display text-2xl font-bold md:text-3xl">
              {isPending
                ? "Checking…"
                : online
                  ? "SERVER ONLINE"
                  : unavailable
                    ? "Server status unavailable"
                    : "SERVER OFFLINE"}
            </h3>
          </div>
          {server?.maintenance_mode && (
            <p className="mt-2 text-sm font-medium text-accent">Maintenance mode is active.</p>
          )}
          {data?.motd && !unavailable && (
            <p className="mt-2 max-w-md text-sm text-muted-foreground">{data.motd}</p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-surface-2/50 px-6 py-5 text-center">
          <p className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.2em] text-muted-foreground">
            <Users className="size-4 text-accent" /> PLAYERS ONLINE
          </p>
          <p className="mt-2 font-display text-4xl font-extrabold">
            {online && data?.playersOnline !== null && data?.playersOnline !== undefined ? (
              <>
                <span className="text-gradient">{data.playersOnline}</span>
                <span className="text-muted-foreground"> / {maxPlayers}</span>
              </>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5 text-sm sm:grid-cols-3">
        <Stat icon={Activity} label="Version" value={(!unavailable && data?.version) || "—"} />
        <Stat
          icon={Gauge}
          label="Latency"
          value={data?.latencyMs && !unavailable ? `${data.latencyMs} ms` : "—"}
        />
        <Stat
          icon={Users}
          label="Refresh"
          value={`${Math.max(30, server?.refresh_interval ?? 45)}s`}
        />
      </div>

    </motion.div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest text-muted-foreground">
        <Icon className="size-3.5 text-accent" /> {label.toUpperCase()}
      </p>
      <p className="mt-1 truncate font-medium">{value}</p>
    </div>
  );
}
