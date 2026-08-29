import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type ServerSettings = Database["public"]["Tables"]["server_settings"]["Row"];
export type Feature = Database["public"]["Tables"]["features"]["Row"];
export type RankCategory = Database["public"]["Tables"]["rank_categories"]["Row"];
export type Rank = Database["public"]["Tables"]["ranks"]["Row"];
export type Rule = Database["public"]["Tables"]["rules"]["Row"];
export type NewsPost = Database["public"]["Tables"]["news"]["Row"];
export type NavItem = Database["public"]["Tables"]["navigation"]["Row"];

export type SiteContent = {
  site: SiteSettings | null;
  server: ServerSettings | null;
  features: Feature[];
  categories: RankCategory[];
  ranks: Rank[];
  rules: Rule[];
  news: NewsPost[];
  navigation: NavItem[];
};

/** Public, read-only website content (SSR safe, no session required). */
export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteContent> => {
    const supabase = publicClient();
    const [site, server, features, categories, ranks, rules, news, navigation] =
      await Promise.all([
        supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
        supabase.from("server_settings").select("*").eq("id", 1).maybeSingle(),
        supabase.from("features").select("*").eq("enabled", true).order("sort_order"),
        supabase.from("rank_categories").select("*").eq("enabled", true).order("sort_order"),
        supabase.from("ranks").select("*").eq("enabled", true).order("sort_order"),
        supabase.from("rules").select("*").eq("enabled", true).order("sort_order"),
        supabase
          .from("news")
          .select("*")
          .eq("published", true)
          .order("published_at", { ascending: false })
          .limit(30),
        supabase.from("navigation").select("*").eq("enabled", true).order("sort_order"),
      ]);

    return {
      site: site.data ?? null,
      server: server.data ?? null,
      features: features.data ?? [],
      categories: categories.data ?? [],
      ranks: ranks.data ?? [],
      rules: rules.data ?? [],
      news: news.data ?? [],
      navigation: navigation.data ?? [],
    };
  },
);
