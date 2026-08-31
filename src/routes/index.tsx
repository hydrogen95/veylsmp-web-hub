import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { siteContentQuery, fullAddress, isSectionVisible } from "@/lib/site";
import { SiteLayout } from "@/components/site/SiteLayout";
import { StatusCard } from "@/components/site/StatusCard";
import {
  DiscordSection,
  FeaturesSection,
  HowToJoinSection,
} from "@/components/site/Sections";
import { CopyButton } from "@/components/site/CopyButton";


export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery),
  head: () => ({
    meta: [
      { title: "VeylSMP | Minecraft Economy Survival Server" },
      {
        name: "description",
        content:
          "Join VeylSMP — a Minecraft Economy Survival server featuring Lifesteal and Java + Bedrock crossplay.",
      },
      { property: "og:title", content: "VeylSMP | Minecraft Economy Survival Server" },
      {
        property: "og:description",
        content:
          "Join VeylSMP — a Minecraft Economy Survival server featuring Lifesteal and Java + Bedrock crossplay.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(siteContentQuery);
  const site = data.site;
  const server = data.server;
  const address = fullAddress(server?.java_ip, server?.java_port);
  const visible = (key: string) => isSectionVisible(site?.sections, key);

  return (
    <SiteLayout>
      <section className="hero-glow relative overflow-hidden">
        <div className="grid-lines absolute inset-0 opacity-60" aria-hidden />
        {site?.hero_background && (
          <img
            src={site.hero_background}
            alt=""
            className="absolute inset-0 size-full object-cover opacity-25"
            aria-hidden
          />
        )}
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-14 text-center md:px-6 md:pt-28 md:pb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold tracking-[0.35em] text-accent"
          >
            {server?.game_modes?.toUpperCase()} · {server?.combat?.toUpperCase()} · CROSSPLAY
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-gradient mt-5 font-display text-5xl font-extrabold sm:text-6xl md:text-7xl"
          >
            {site?.hero_title}
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
          >
            {site?.hero_headline}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg"
          >
            {site?.hero_subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <a
              href={site?.primary_button_url || "#connect"}
              className="bg-brand inline-flex min-h-12 w-full items-center justify-center rounded-xl px-8 text-sm font-bold tracking-wide text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.03] sm:w-auto"
            >
              {site?.primary_button_label}
            </a>
            <a
              href={site?.discord_url ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-border bg-surface-2/60 px-8 text-sm font-bold tracking-wide transition-colors hover:border-accent/60 sm:w-auto"
            >
              {site?.secondary_button_label}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-10 flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl border border-border bg-surface/60 p-4 backdrop-blur-md sm:flex-row sm:justify-between"
          >
            <p className="font-mono text-base font-semibold tracking-tight sm:text-lg">
              {address}
            </p>
            <CopyButton value={address} className="w-full sm:w-auto" />
          </motion.div>
        </div>
      </section>

      {visible("status") && server?.show_status !== false && (
        <section className="relative -mt-4 pb-4">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <StatusCard server={server} />
          </div>
        </section>
      )}

      {visible("connect") && (
        <section className="section-pad">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <ConnectionCard content={data} />
          </div>
        </section>
      )}

      {visible("crossplay") && <CrossplaySection content={data} />}
      {visible("features") && <FeaturesSection content={data} />}
      {visible("info") && <ServerInfoSection content={data} />}
      {visible("ranks") && <RanksSection content={data} limit={3} />}
      {visible("news") && <NewsSection content={data} />}
      {visible("join") && <HowToJoinSection content={data} />}
      {visible("discord") && <DiscordSection content={data} />}
    </SiteLayout>
  );
}
