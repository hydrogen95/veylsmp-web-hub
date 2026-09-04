import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Blocks,
  Gauge,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Newspaper,
  Plus,
  ScrollText,
  Server,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminCard, Button, Field, Select, TextArea, TextInput, Toggle } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { consumeBridgeSession, signInWithGoogle } from "@/lib/auth-bridge";
import { joinStatusMeta } from "@/routes/account";
import type { Database } from "@/integrations/supabase/types";
import type {
  Feature,
  NavItem,
  NewsPost,
  Rank,
  RankCategory,
  Rule,
  ServerSettings,
  SiteSettings,
} from "@/lib/content.functions";

type Player = Database["public"]["Tables"]["players"]["Row"];

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — VeylSMP" },
      { name: "description", content: "Private VeylSMP content management dashboard." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin Dashboard — VeylSMP" },
      { property: "og:description", content: "Private VeylSMP content management dashboard." },
    ],
  }),
  component: AdminPage,
});

type Tab =
  | "server"
  | "homepage"
  | "features"
  | "ranks"
  | "rules"
  | "news"
  | "navigation"
  | "players";

const tabGroups: Array<{
  group: string;
  items: Array<{ key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }>;
}> = [
  {
    group: "Server",
    items: [
      { key: "server", label: "Server & status", icon: Server },
      { key: "players", label: "Players", icon: Users },
    ],
  },
  {
    group: "Content",
    items: [
      { key: "homepage", label: "Homepage", icon: LayoutDashboard },
      { key: "features", label: "Features", icon: Sparkles },
      { key: "ranks", label: "Ranks & store", icon: Gauge },
      { key: "rules", label: "Rules", icon: ScrollText },
      { key: "news", label: "News", icon: Newspaper },
    ],
  },
  {
    group: "Structure",
    items: [{ key: "navigation", label: "Navigation", icon: ListOrdered }],
  },
];


function useSession() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await consumeBridgeSession();
      const { data } = await supabase.auth.getSession();
      setEmail(data.session?.user.email ?? null);
      setReady(true);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user.email ?? null);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { email, ready };
}

function AdminPage() {
  const { email, ready } = useSession();
  const [tab, setTab] = useState<Tab>("server");

  const allowed = useQuery({
    queryKey: ["is-admin", email],
    enabled: Boolean(email),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_users")
        .select("email")
        .eq("email", email!)
        .maybeSingle();
      if (error) throw error;
      return Boolean(data);
    },
  });

  async function signIn() {
    const err = await signInWithGoogle("/admin");
    if (err) toast.error("Sign-in failed", { description: err });
  }


  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
  }

  if (!ready) return <Shell>{null}</Shell>;

  if (!email) {
    return (
      <Shell>
        <div className="glass-card mx-auto max-w-md p-8 text-center">
          <span className="bg-brand mx-auto flex size-12 items-center justify-center rounded-2xl">
            <Blocks className="size-6 text-primary-foreground" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-extrabold">ADMIN LOGIN</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Only the authorized VeylSMP owner account can access this dashboard.
          </p>
          <Button onClick={signIn} className="mt-6 w-full">
            Continue with Google
          </Button>
        </div>
      </Shell>
    );
  }

  if (allowed.isPending) return <Shell>{null}</Shell>;

  if (!allowed.data) {
    return (
      <Shell>
        <div className="glass-card mx-auto max-w-md p-8 text-center">
          <h1 className="font-display text-2xl font-extrabold">ACCESS DENIED</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {email} is not authorized to manage VeylSMP.
          </p>
          <Button variant="ghost" onClick={signOut} className="mt-6 w-full">
            <LogOut className="mr-2 size-4" /> Sign out
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold md:text-3xl">ADMIN DASHBOARD</h1>
          <p className="text-sm text-muted-foreground">Signed in as {email}</p>
        </div>
        <Button variant="ghost" onClick={signOut}>
          <LogOut className="mr-2 size-4" /> Sign out
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[230px_1fr]">
        <nav className="glass-card flex gap-3 overflow-x-auto p-3 md:flex-col md:gap-4 md:overflow-visible">
          {tabGroups.map((group) => (
            <div key={group.group} className="flex shrink-0 gap-1 md:flex-col">
              <p className="hidden px-3 pb-1 text-[10px] font-semibold tracking-widest text-muted-foreground md:block">
                {group.group.toUpperCase()}
              </p>
              {group.items.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors",
                    tab === t.key
                      ? "bg-surface-2 text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <t.icon className="size-4 text-accent" /> {t.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="space-y-6">
          {tab === "server" && <ServerEditor />}
          {tab === "players" && <PlayersEditor />}
          {tab === "homepage" && <HomepageEditor />}
          {tab === "features" && <FeaturesEditor />}
          {tab === "ranks" && <RanksEditor />}
          {tab === "rules" && <RulesEditor />}
          {tab === "news" && <NewsEditor />}
          {tab === "navigation" && <NavigationEditor />}
        </div>

        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="hero-glow relative">
        <div className="grid-lines absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">{children}</div>
      </div>
    </div>
  );
}

/* ---------- shared data helpers ---------- */

function useTable<T>(table: string, order: string) {
  return useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table as never)
        .select("*")
        .order(order as never);
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}

function useRefresh(table: string) {
  const qc = useQueryClient();
  return async () => {
    await qc.invalidateQueries({ queryKey: ["admin", table] });
    await qc.invalidateQueries({ queryKey: ["site-content"] });
  };
}

async function saveRow(table: string, values: Record<string, unknown>, refresh: () => Promise<void>) {
  const { error } = await supabase.from(table as never).upsert(values as never);
  if (error) {
    toast.error("Save failed", { description: error.message });
    return;
  }
  toast.success("Saved");
  await refresh();
}

async function deleteRow(table: string, id: string, refresh: () => Promise<void>) {
  const { error } = await supabase
    .from(table as never)
    .delete()
    .eq("id", id);
  if (error) {
    toast.error("Delete failed", { description: error.message });
    return;
  }
  toast.success("Deleted");
  await refresh();
}

/* ---------- editors ---------- */

function ServerEditor() {
  const { data } = useTable<ServerSettings>("server_settings", "id");
  const refresh = useRefresh("server_settings");
  const row = data?.[0];
  const [form, setForm] = useState<ServerSettings | null>(null);
  useEffect(() => setForm(row ?? null), [row]);
  if (!form) return null;
  const set = (patch: Partial<ServerSettings>) => setForm({ ...form, ...patch });

  return (
    <>
      <AdminCard title="Server details" description="Shown across the site.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Server name">
            <TextInput value={form.server_name} onChange={(e) => set({ server_name: e.target.value })} />
          </Field>
          <Field label="Version">
            <TextInput
              value={form.server_version}
              onChange={(e) => set({ server_version: e.target.value })}
            />
          </Field>
          <Field label="Java IP">
            <TextInput value={form.java_ip} onChange={(e) => set({ java_ip: e.target.value })} />
          </Field>
          <Field label="Java port">
            <TextInput value={form.java_port} onChange={(e) => set({ java_port: e.target.value })} />
          </Field>
          <Field label="Bedrock IP">
            <TextInput value={form.bedrock_ip} onChange={(e) => set({ bedrock_ip: e.target.value })} />
          </Field>
          <Field label="Bedrock port">
            <TextInput
              value={form.bedrock_port}
              onChange={(e) => set({ bedrock_port: e.target.value })}
            />
          </Field>
          <Field label="Game modes">
            <TextInput value={form.game_modes} onChange={(e) => set({ game_modes: e.target.value })} />
          </Field>
          <Field label="Combat">
            <TextInput value={form.combat} onChange={(e) => set({ combat: e.target.value })} />
          </Field>
          <Field label="Platform">
            <TextInput value={form.platform} onChange={(e) => set({ platform: e.target.value })} />
          </Field>
          <Field label="Max players">
            <TextInput
              type="number"
              value={form.max_players}
              onChange={(e) => set({ max_players: Number(e.target.value) })}
            />
          </Field>
        </div>
        <Field label="Description">
          <TextArea value={form.description} onChange={(e) => set({ description: e.target.value })} />
        </Field>
      </AdminCard>

      <AdminCard title="Live status" description="Controls the status card and its refresh rate.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status host">
            <TextInput value={form.status_host} onChange={(e) => set({ status_host: e.target.value })} />
          </Field>
          <Field label="Status port">
            <TextInput value={form.status_port} onChange={(e) => set({ status_port: e.target.value })} />
          </Field>
          <Field label="Refresh interval (seconds)">
            <TextInput
              type="number"
              value={form.refresh_interval}
              onChange={(e) => set({ refresh_interval: Number(e.target.value) })}
            />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle label="Show status card" checked={form.show_status} onChange={(v) => set({ show_status: v })} />
          <Toggle label="Maintenance mode" checked={form.maintenance_mode} onChange={(v) => set({ maintenance_mode: v })} />
          <Toggle label="Check Java" checked={form.check_java} onChange={(v) => set({ check_java: v })} />
          <Toggle label="Check Bedrock" checked={form.check_bedrock} onChange={(v) => set({ check_bedrock: v })} />
        </div>
        <Button onClick={() => saveRow("server_settings", { ...form, updated_at: new Date().toISOString() }, refresh)}>
          Save server settings
        </Button>
      </AdminCard>
    </>
  );
}

function HomepageEditor() {
  const { data } = useTable<SiteSettings>("site_settings", "id");
  const refresh = useRefresh("site_settings");
  const row = data?.[0];
  const [form, setForm] = useState<SiteSettings | null>(null);
  useEffect(() => setForm(row ?? null), [row]);
  if (!form) return null;
  const set = (patch: Partial<SiteSettings>) => setForm({ ...form, ...patch });

  return (
    <>
      <AdminCard title="Hero" description="The first thing visitors read.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <TextInput value={form.hero_title} onChange={(e) => set({ hero_title: e.target.value })} />
          </Field>
          <Field label="Headline">
            <TextInput value={form.hero_headline} onChange={(e) => set({ hero_headline: e.target.value })} />
          </Field>
        </div>
        <Field label="Subtitle">
          <TextArea value={form.hero_subtitle} onChange={(e) => set({ hero_subtitle: e.target.value })} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Primary button label">
            <TextInput
              value={form.primary_button_label}
              onChange={(e) => set({ primary_button_label: e.target.value })}
            />
          </Field>
          <Field label="Primary button URL">
            <TextInput
              value={form.primary_button_url}
              onChange={(e) => set({ primary_button_url: e.target.value })}
            />
          </Field>
          <Field label="Secondary button label">
            <TextInput
              value={form.secondary_button_label}
              onChange={(e) => set({ secondary_button_label: e.target.value })}
            />
          </Field>
          <Field label="Hero background image URL">
            <TextInput
              value={form.hero_background ?? ""}
              onChange={(e) => set({ hero_background: e.target.value || null })}
            />
          </Field>
          <Field label="Logo URL">
            <TextInput value={form.logo_url ?? ""} onChange={(e) => set({ logo_url: e.target.value || null })} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Discord" description="Community call-to-action section.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Discord invite URL">
            <TextInput value={form.discord_url} onChange={(e) => set({ discord_url: e.target.value })} />
          </Field>
          <Field label="Widget server ID (optional)">
            <TextInput
              value={form.discord_widget_id ?? ""}
              onChange={(e) => set({ discord_widget_id: e.target.value || null })}
            />
          </Field>
          <Field label="Section title">
            <TextInput value={form.discord_title} onChange={(e) => set({ discord_title: e.target.value })} />
          </Field>
        </div>
        <Field label="Section description">
          <TextArea
            value={form.discord_description}
            onChange={(e) => set({ discord_description: e.target.value })}
          />
        </Field>
      </AdminCard>

      <AdminCard title="How to join" description="One step per line.">
        <Field label="Java steps">
          <TextArea
            rows={5}
            value={form.java_steps.join("\n")}
            onChange={(e) => set({ java_steps: e.target.value.split("\n") })}
          />
        </Field>
        <Field label="Bedrock steps">
          <TextArea
            rows={5}
            value={form.bedrock_steps.join("\n")}
            onChange={(e) => set({ bedrock_steps: e.target.value.split("\n") })}
          />
        </Field>
        <Button
          onClick={() =>
            saveRow(
              "site_settings",
              {
                ...form,
                java_steps: form.java_steps.map((s) => s.trim()).filter(Boolean),
                bedrock_steps: form.bedrock_steps.map((s) => s.trim()).filter(Boolean),
                updated_at: new Date().toISOString(),
              },
              refresh,
            )
          }
        >
          Save homepage
        </Button>
      </AdminCard>
    </>
  );
}

function FeaturesEditor() {
  const { data } = useTable<Feature>("features", "sort_order");
  const refresh = useRefresh("features");
  const [rows, setRows] = useState<Feature[]>([]);
  useEffect(() => setRows(data ?? []), [data]);

  return (
    <AdminCard title="Features" description="The cards shown in the “Why VeylSMP?” grid.">
      {rows.map((row, i) => (
        <div key={row.id} className="rounded-2xl border border-border p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title">
              <TextInput
                value={row.title}
                onChange={(e) =>
                  setRows(rows.map((r, j) => (i === j ? { ...r, title: e.target.value } : r)))
                }
              />
            </Field>
            <Field label="Lucide icon name">
              <TextInput
                value={row.icon}
                onChange={(e) =>
                  setRows(rows.map((r, j) => (i === j ? { ...r, icon: e.target.value } : r)))
                }
              />
            </Field>
          </div>
          <Field label="Description" className="mt-3">
            <TextArea
              value={row.description}
              onChange={(e) =>
                setRows(rows.map((r, j) => (i === j ? { ...r, description: e.target.value } : r)))
              }
            />
          </Field>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Sort order">
              <TextInput
                type="number"
                value={row.sort_order}
                onChange={(e) =>
                  setRows(
                    rows.map((r, j) => (i === j ? { ...r, sort_order: Number(e.target.value) } : r)),
                  )
                }
              />
            </Field>
            <div className="flex items-end">
              <Toggle
                label="Enabled"
                checked={row.enabled}
                onChange={(v) => setRows(rows.map((r, j) => (i === j ? { ...r, enabled: v } : r)))}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => saveRow("features", row, refresh)}>Save</Button>
            <Button variant="danger" onClick={() => deleteRow("features", row.id, refresh)}>
              <Trash2 className="mr-2 size-4" /> Delete
            </Button>
          </div>
        </div>
      ))}
      <Button
        variant="ghost"
        onClick={() =>
          saveRow(
            "features",
            { title: "New feature", description: "", icon: "Sparkles", sort_order: rows.length + 1 },
            refresh,
          )
        }
      >
        <Plus className="mr-2 size-4" /> Add feature
      </Button>
    </AdminCard>
  );
}

function RanksEditor() {
  const categories = useTable<RankCategory>("rank_categories", "sort_order");
  const ranks = useTable<Rank>("ranks", "sort_order");
  const refreshCats = useRefresh("rank_categories");
  const refreshRanks = useRefresh("ranks");
  const [rows, setRows] = useState<Rank[]>([]);
  useEffect(() => setRows(ranks.data ?? []), [ranks.data]);
  const cats = useMemo(() => categories.data ?? [], [categories.data]);

  return (
    <>
      <AdminCard title="Rank categories">
        {cats.map((c) => (
          <div key={c.id} className="flex flex-wrap items-end gap-3 rounded-2xl border border-border p-4">
            <Field label="Name" className="flex-1">
              <TextInput
                defaultValue={c.name}
                onBlur={(e) => saveRow("rank_categories", { ...c, name: e.target.value }, refreshCats)}
              />
            </Field>
            <Field label="Description" className="flex-1">
              <TextInput
                defaultValue={c.description}
                onBlur={(e) =>
                  saveRow("rank_categories", { ...c, description: e.target.value }, refreshCats)
                }
              />
            </Field>
            <Button variant="danger" onClick={() => deleteRow("rank_categories", c.id, refreshCats)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="ghost"
          onClick={() =>
            saveRow("rank_categories", { name: "New category", sort_order: cats.length + 1 }, refreshCats)
          }
        >
          <Plus className="mr-2 size-4" /> Add category
        </Button>
      </AdminCard>

      <AdminCard title="Ranks" description="Prices, perks and purchase links.">
        {rows.map((row, i) => {
          const patch = (p: Partial<Rank>) => setRows(rows.map((r, j) => (i === j ? { ...r, ...p } : r)));
          return (
            <div key={row.id} className="rounded-2xl border border-border p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Name">
                  <TextInput value={row.name} onChange={(e) => patch({ name: e.target.value })} />
                </Field>
                <Field label="Category">
                  <Select
                    value={row.category_id ?? ""}
                    onChange={(e) => patch({ category_id: e.target.value || null })}
                  >
                    <option value="">Uncategorized</option>
                    {cats.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Price">
                  <TextInput
                    type="number"
                    value={row.price}
                    onChange={(e) => patch({ price: Number(e.target.value) })}
                  />
                </Field>
                <Field label="Currency">
                  <TextInput value={row.currency} onChange={(e) => patch({ currency: e.target.value })} />
                </Field>
                <Field label="Duration">
                  <TextInput value={row.duration} onChange={(e) => patch({ duration: e.target.value })} />
                </Field>
                <Field label="Color (hex)">
                  <TextInput value={row.color} onChange={(e) => patch({ color: e.target.value })} />
                </Field>
                <Field label="Lucide icon">
                  <TextInput value={row.icon} onChange={(e) => patch({ icon: e.target.value })} />
                </Field>
                <Field label="Purchase URL">
                  <TextInput
                    value={row.purchase_url}
                    onChange={(e) => patch({ purchase_url: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Description" className="mt-3">
                <TextArea value={row.description} onChange={(e) => patch({ description: e.target.value })} />
              </Field>
              <Field label="Perks (one per line)" className="mt-3">
                <TextArea
                  rows={4}
                  value={row.features.join("\n")}
                  onChange={(e) => patch({ features: e.target.value.split("\n") })}
                />
              </Field>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="Sort order">
                  <TextInput
                    type="number"
                    value={row.sort_order}
                    onChange={(e) => patch({ sort_order: Number(e.target.value) })}
                  />
                </Field>
                <div className="flex items-end">
                  <Toggle label="Enabled" checked={row.enabled} onChange={(v) => patch({ enabled: v })} />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() =>
                    saveRow(
                      "ranks",
                      { ...row, features: row.features.map((f) => f.trim()).filter(Boolean) },
                      refreshRanks,
                    )
                  }
                >
                  Save
                </Button>
                <Button variant="danger" onClick={() => deleteRow("ranks", row.id, refreshRanks)}>
                  <Trash2 className="mr-2 size-4" /> Delete
                </Button>
              </div>
            </div>
          );
        })}
        <Button
          variant="ghost"
          onClick={() =>
            saveRow(
              "ranks",
              {
                name: "New rank",
                category_id: cats[0]?.id ?? null,
                sort_order: rows.length + 1,
                features: [],
              },
              refreshRanks,
            )
          }
        >
          <Plus className="mr-2 size-4" /> Add rank
        </Button>
      </AdminCard>
    </>
  );
}

function RulesEditor() {
  const { data } = useTable<Rule>("rules", "sort_order");
  const refresh = useRefresh("rules");
  const [rows, setRows] = useState<Rule[]>([]);
  useEffect(() => setRows(data ?? []), [data]);

  return (
    <AdminCard title="Rules">
      {rows.map((row, i) => {
        const patch = (p: Partial<Rule>) => setRows(rows.map((r, j) => (i === j ? { ...r, ...p } : r)));
        return (
          <div key={row.id} className="rounded-2xl border border-border p-4">
            <Field label="Title">
              <TextInput value={row.title} onChange={(e) => patch({ title: e.target.value })} />
            </Field>
            <Field label="Content" className="mt-3">
              <TextArea value={row.content} onChange={(e) => patch({ content: e.target.value })} />
            </Field>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Sort order">
                <TextInput
                  type="number"
                  value={row.sort_order}
                  onChange={(e) => patch({ sort_order: Number(e.target.value) })}
                />
              </Field>
              <div className="flex items-end">
                <Toggle label="Enabled" checked={row.enabled} onChange={(v) => patch({ enabled: v })} />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => saveRow("rules", row, refresh)}>Save</Button>
              <Button variant="danger" onClick={() => deleteRow("rules", row.id, refresh)}>
                <Trash2 className="mr-2 size-4" /> Delete
              </Button>
            </div>
          </div>
        );
      })}
      <Button
        variant="ghost"
        onClick={() =>
          saveRow("rules", { title: "New rule", content: "", sort_order: rows.length + 1 }, refresh)
        }
      >
        <Plus className="mr-2 size-4" /> Add rule
      </Button>
    </AdminCard>
  );
}

function NewsEditor() {
  const { data } = useTable<NewsPost>("news", "published_at");
  const refresh = useRefresh("news");
  const [rows, setRows] = useState<NewsPost[]>([]);
  useEffect(() => setRows(data ?? []), [data]);

  return (
    <AdminCard title="News posts">
      {rows.map((row, i) => {
        const patch = (p: Partial<NewsPost>) =>
          setRows(rows.map((r, j) => (i === j ? { ...r, ...p } : r)));
        return (
          <div key={row.id} className="rounded-2xl border border-border p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title">
                <TextInput value={row.title} onChange={(e) => patch({ title: e.target.value })} />
              </Field>
              <Field label="Category">
                <TextInput value={row.category} onChange={(e) => patch({ category: e.target.value })} />
              </Field>
              <Field label="Author">
                <TextInput value={row.author} onChange={(e) => patch({ author: e.target.value })} />
              </Field>
              <Field label="Image URL">
                <TextInput
                  value={row.image_url ?? ""}
                  onChange={(e) => patch({ image_url: e.target.value || null })}
                />
              </Field>
            </div>
            <Field label="Content" className="mt-3">
              <TextArea
                rows={4}
                value={row.description}
                onChange={(e) => patch({ description: e.target.value })}
              />
            </Field>
            <div className="mt-3">
              <Toggle label="Published" checked={row.published} onChange={(v) => patch({ published: v })} />
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => saveRow("news", row, refresh)}>Save</Button>
              <Button variant="danger" onClick={() => deleteRow("news", row.id, refresh)}>
                <Trash2 className="mr-2 size-4" /> Delete
              </Button>
            </div>
          </div>
        );
      })}
      <Button
        variant="ghost"
        onClick={() =>
          saveRow(
            "news",
            { title: "New post", description: "", category: "Update", published: false },
            refresh,
          )
        }
      >
        <Plus className="mr-2 size-4" /> Add post
      </Button>
    </AdminCard>
  );
}

function NavigationEditor() {
  const { data } = useTable<NavItem>("navigation", "sort_order");
  const refresh = useRefresh("navigation");
  const [rows, setRows] = useState<NavItem[]>([]);
  useEffect(() => setRows(data ?? []), [data]);

  return (
    <AdminCard title="Navigation" description="Header and footer links.">
      {rows.map((row, i) => {
        const patch = (p: Partial<NavItem>) => setRows(rows.map((r, j) => (i === j ? { ...r, ...p } : r)));
        return (
          <div key={row.id} className="grid gap-3 rounded-2xl border border-border p-4 sm:grid-cols-2">
            <Field label="Label">
              <TextInput value={row.label} onChange={(e) => patch({ label: e.target.value })} />
            </Field>
            <Field label="Href">
              <TextInput value={row.href} onChange={(e) => patch({ href: e.target.value })} />
            </Field>
            <Field label="Sort order">
              <TextInput
                type="number"
                value={row.sort_order}
                onChange={(e) => patch({ sort_order: Number(e.target.value) })}
              />
            </Field>
            <div className="flex items-end">
              <Toggle label="Enabled" checked={row.enabled} onChange={(v) => patch({ enabled: v })} />
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <Button onClick={() => saveRow("navigation", row, refresh)}>Save</Button>
              <Button variant="danger" onClick={() => deleteRow("navigation", row.id, refresh)}>
                <Trash2 className="mr-2 size-4" /> Delete
              </Button>
            </div>
          </div>
        );
      })}
      <Button
        variant="ghost"
        onClick={() =>
          saveRow("navigation", { label: "New link", href: "/", sort_order: rows.length + 1 }, refresh)
        }
      >
        <Plus className="mr-2 size-4" /> Add link
      </Button>
    </AdminCard>
  );
}
