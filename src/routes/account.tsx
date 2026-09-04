import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { toast } from "sonner";
import { CheckCircle2, Clock, Coins, Crown, LogOut, ShieldAlert, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button, Field, Select, TextInput } from "@/components/admin/ui";
import { joinStatusMeta, siteContentQuery } from "@/lib/site";
import { consumeBridgeSession, signInWithGoogle } from "@/lib/auth-bridge";
import type { Database } from "@/integrations/supabase/types";

type Player = Database["public"]["Tables"]["players"]["Row"];

export const Route = createFileRoute("/account")({
  ssr: false,
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery),
  head: () => ({
    meta: [
      { title: "My Account — VeylSMP Player Profile" },
      {
        name: "description",
        content:
          "Sign in to your VeylSMP player account to see your rank, points and join status, and set your Minecraft username.",
      },
      { property: "og:title", content: "My Account — VeylSMP Player Profile" },
      {
        property: "og:description",
        content: "See your VeylSMP rank, points and join status in one place.",
      },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const qc = useQueryClient();
  const { data: content } = useSuspenseQuery(siteContentQuery);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      await consumeBridgeSession();
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setUserId(data.session?.user.id ?? null);
      setEmail(data.session?.user.email ?? null);
      setName((data.session?.user.user_metadata?.["full_name"] as string) ?? null);
      setReady(true);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user.id ?? null);
      setEmail(session?.user.email ?? null);
      setName((session?.user.user_metadata?.["full_name"] as string) ?? null);
      setReady(true);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const player = useQuery({
    queryKey: ["player", userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Player | null> => {
      const existing = await supabase.from("players").select("*").eq("user_id", userId!).maybeSingle();
      if (existing.error) throw existing.error;
      if (existing.data) return existing.data;
      const created = await supabase
        .from("players")
        .insert({ user_id: userId!, email, display_name: name })
        .select("*")
        .single();
      if (created.error) throw created.error;
      return created.data;
    },
  });

  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState("java");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (player.data) {
      setUsername(player.data.minecraft_username ?? "");
      setPlatform(player.data.platform ?? "java");
    }
  }, [player.data]);

  async function save() {
    if (!player.data) return;
    setSaving(true);
    const { error } = await supabase
      .from("players")
      .update({ minecraft_username: username.trim() || null, platform })
      .eq("id", player.data.id);
    setSaving(false);
    if (error) {
      toast.error("Could not save", { description: error.message });
      return;
    }
    toast.success("Profile updated");
    await qc.invalidateQueries({ queryKey: ["player", userId] });
  }

  async function signIn() {
    const err = await signInWithGoogle("/account");
    if (err) toast.error("Sign-in failed", { description: err });
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.removeQueries({ queryKey: ["player"] });
    await supabase.auth.signOut();
    toast.success("Signed out");
  }

  const rank = content.ranks.find((r) => r.id === player.data?.rank_id);
  const rankName = rank?.name ?? player.data?.rank_label ?? "No rank yet";
  const status = joinStatusMeta[player.data?.join_status ?? "pending"] ?? { label: "Pending review" };

  return (
    <SiteLayout>
      <section className="hero-glow relative overflow-hidden">
        <div className="grid-lines absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 pt-16 pb-12 md:px-6 md:pt-20">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-gradient font-display text-4xl font-extrabold md:text-5xl"
          >
            MY ACCOUNT
          </motion.h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Your VeylSMP player profile — rank, points and join status, all in one place.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-20 md:px-6">
        {!ready ? (
          <div className="glass-card p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : !userId ? (
          <div className="glass-card mx-auto max-w-md p-8 text-center">
            <span className="bg-brand mx-auto flex size-12 items-center justify-center rounded-2xl">
              <User className="size-6 text-primary-foreground" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-extrabold">PLAYER LOGIN</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to view your rank, points and join status.
            </p>
            <Button onClick={signIn} className="mt-6 w-full">
              Continue with Google
            </Button>
          </div>
        ) : player.isPending ? (
          <div className="glass-card p-8 text-center text-sm text-muted-foreground">
            Loading your profile…
          </div>
        ) : player.error ? (
          <div className="glass-card p-8 text-center">
            <ShieldAlert className="mx-auto size-6 text-destructive" />
            <p className="mt-3 text-sm text-muted-foreground">
              {(player.error as Error).message}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat
                icon={Crown}
                label="Rank"
                value={rankName}
                accent={rank?.color ?? undefined}
              />
              <Stat icon={Coins} label="Points" value={String(player.data?.points ?? 0)} />
              <Stat
                icon={player.data?.join_status === "pending" ? Clock : CheckCircle2}
                label="Join status"
                value={status.label}
              />
            </div>

            <div className="glass-card p-5 md:p-6">
              <h2 className="font-display text-lg font-bold">Player details</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Signed in as {email}. Rank, points and join status are set by the VeylSMP staff.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Minecraft username">
                  <TextInput
                    value={username}
                    placeholder="e.g. Steve"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Field>
                <Field label="Platform">
                  <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                    <option value="java">Java</option>
                    <option value="bedrock">Bedrock</option>
                    <option value="both">Java + Bedrock</option>
                  </Select>
                </Field>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button onClick={save} disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </Button>
                <Button variant="ghost" onClick={signOut}>
                  <LogOut className="mr-2 size-4" /> Sign out
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="glass-card p-5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-surface-2/70">
        <Icon className="size-4 text-accent" />
      </span>
      <p className="mt-3 text-[11px] font-semibold tracking-widest text-muted-foreground">
        {label.toUpperCase()}
      </p>
      <p className="mt-1 font-display text-xl font-extrabold" style={accent ? { color: accent } : undefined}>
        {value}
      </p>
    </div>
  );
}
