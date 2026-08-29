import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Check, MessagesSquare, Server, Smartphone } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { formatPrice, fullAddress, icon } from "@/lib/site";
import type { SiteContent } from "@/lib/content.functions";

const rise = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 } as const,
  transition: { duration: 0.5 },
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <motion.div {...rise} className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className="text-xs font-semibold tracking-[0.25em] text-accent">{eyebrow}</p>
      )}
      <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-muted-foreground">{description}</p>}
    </motion.div>
  );
}

export function ConnectionCard({ content }: { content: SiteContent }) {
  const s = content.server;
  const address = fullAddress(s?.java_ip, s?.java_port);
  return (
    <motion.div {...rise} id="connect" className="glass-card glow-hover p-6 md:p-8">
      <div className="flex items-center gap-3">
        <span className="bg-brand flex size-10 items-center justify-center rounded-xl">
          <Server className="size-5 text-primary-foreground" />
        </span>
        <h3 className="font-display text-xl font-bold">JAVA EDITION</h3>
      </div>
      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <Field label="IP" value={s?.java_ip ?? "—"} />
        <Field label="Port" value={s?.java_port ?? "—"} />
        <Field label="Full Address" value={address} />
      </dl>
      <CopyButton value={address} label="COPY SERVER IP" className="mt-6 w-full sm:w-auto" />
    </motion.div>
  );
}

export function CrossplaySection({ content }: { content: SiteContent }) {
  const s = content.server;
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="CROSSPLAY"
          title="PLAY FROM JAVA OR BEDROCK"
          description="Java and Bedrock players share the same world on VeylSMP."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <PlatformCard
            title="JAVA PLAYERS"
            icon={<Server className="size-5 text-primary-foreground" />}
            ip={s?.java_ip ?? ""}
            port={s?.java_port ?? ""}
          />
          <PlatformCard
            title="BEDROCK PLAYERS"
            icon={<Smartphone className="size-5 text-primary-foreground" />}
            ip={s?.bedrock_ip ?? ""}
            port={s?.bedrock_port ?? ""}
          />
        </div>
      </div>
    </section>
  );
}

function PlatformCard({
  title,
  icon: iconNode,
  ip,
  port,
}: {
  title: string;
  icon: React.ReactNode;
  ip: string;
  port: string;
}) {
  return (
    <motion.div {...rise} className="glass-card glow-hover p-6">
      <div className="flex items-center gap-3">
        <span className="bg-brand flex size-10 items-center justify-center rounded-xl">
          {iconNode}
        </span>
        <h3 className="font-display text-lg font-bold">{title}</h3>
      </div>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="IP" value={ip || "—"} />
        <Field label="Port" value={port || "—"} />
      </dl>
      <CopyButton value={fullAddress(ip, port)} label="COPY ADDRESS" className="mt-5 w-full" />
    </motion.div>
  );
}

export function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-surface-2/40 px-4 py-3">
      <dt className="text-[11px] font-semibold tracking-widest text-muted-foreground">
        {label.toUpperCase()}
      </dt>
      <dd className="mt-1 truncate font-mono text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function FeaturesSection({ content }: { content: SiteContent }) {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading eyebrow="FEATURES" title="WHY VEYLSMP?" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.features.map((f, i) => {
            const Icon = icon(f.icon);
            return (
              <motion.article
                key={f.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="glass-card glow-hover p-6"
              >
                <span className="bg-brand flex size-11 items-center justify-center rounded-xl">
                  <Icon className="size-5 text-primary-foreground" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ServerInfoSection({ content }: { content: SiteContent }) {
  const s = content.server;
  const rows: Array<[string, string]> = [
    ["Server Name", s?.server_name ?? ""],
    ["Gameplay", s?.game_modes ?? ""],
    ["Combat", s?.combat ?? ""],
    ["Platform", s?.platform ?? ""],
    ["IP", s?.java_ip ?? ""],
    ["Port", s?.java_port ?? ""],
  ];
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading eyebrow="INFO" title="SERVER INFO" />
        <motion.dl {...rise} className="glass-card mt-10 grid gap-4 p-6 sm:grid-cols-2 md:p-8">
          {rows.map(([label, value]) => (
            <Field key={label} label={label} value={value || "—"} />
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

export function RanksSection({ content, limit }: { content: SiteContent; limit?: number }) {
  const categories = content.categories;
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="STORE"
          title="RANKS"
          description="Support VeylSMP and unlock in-game perks."
        />
        <div className="mt-10 space-y-14">
          {categories.map((cat) => {
            const ranks = content.ranks.filter((r) => r.category_id === cat.id);
            const shown = limit ? ranks.slice(0, limit) : ranks;
            if (!shown.length) return null;
            return (
              <div key={cat.id}>
                <div className="mb-6 text-center">
                  <h3 className="font-display text-2xl font-bold">{cat.name}</h3>
                  {cat.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                  )}
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {shown.map((rank, i) => {
                    const Icon = icon(rank.icon);
                    return (
                      <motion.article
                        key={rank.id}
                        initial={{ opacity: 0, y: 26 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.45, delay: i * 0.05 }}
                        className="glass-card glow-hover flex flex-col p-6"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="flex size-11 items-center justify-center rounded-xl"
                            style={{ backgroundColor: `${rank.color}22`, color: rank.color }}
                          >
                            <Icon className="size-5" />
                          </span>
                          <span className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold tracking-widest text-muted-foreground">
                            {rank.duration}
                          </span>
                        </div>
                        <h4
                          className="mt-4 font-display text-xl font-extrabold"
                          style={{ color: rank.color }}
                        >
                          {rank.name}
                        </h4>
                        <p className="mt-1 font-display text-3xl font-extrabold">
                          {formatPrice(Number(rank.price), rank.currency)}
                        </p>
                        {rank.description && (
                          <p className="mt-2 text-sm text-muted-foreground">{rank.description}</p>
                        )}
                        <ul className="mt-4 space-y-2 text-sm">
                          {rank.features.map((f) => (
                            <li key={f} className="flex items-start gap-2">
                              <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                              <span className="text-muted-foreground">{f}</span>
                            </li>
                          ))}
                        </ul>
                        <a
                          href={rank.purchase_url || content.site?.discord_url || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-brand mt-6 inline-flex min-h-12 items-center justify-center rounded-xl text-sm font-bold tracking-wide text-primary-foreground transition-transform hover:scale-[1.02]"
                        >
                          BUY NOW
                        </a>
                      </motion.article>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {!categories.length && (
            <p className="text-center text-muted-foreground">No ranks published yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export function HowToJoinSection({ content }: { content: SiteContent }) {
  const site = content.site;
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading eyebrow="GET STARTED" title="HOW TO JOIN" />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <StepCard title="JAVA EDITION" steps={site?.java_steps ?? []} />
          <StepCard title="BEDROCK EDITION" steps={site?.bedrock_steps ?? []} />
        </div>
      </div>
    </section>
  );
}

function StepCard({ title, steps }: { title: string; steps: string[] }) {
  return (
    <motion.div {...rise} className="glass-card glow-hover p-6 md:p-8">
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <ol className="mt-5 space-y-4">
        {steps.map((step, i) => (
          <li key={`${step}-${i}`} className="flex gap-3">
            <span className="bg-brand flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground">
              {i + 1}
            </span>
            <span className="text-sm text-muted-foreground">{step}</span>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

export function DiscordSection({ content }: { content: SiteContent }) {
  const site = content.site;
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          {...rise}
          className="glass-card hero-glow relative overflow-hidden p-8 text-center md:p-14"
        >
          <span className="bg-brand mx-auto flex size-14 items-center justify-center rounded-2xl">
            <MessagesSquare className="size-7 text-primary-foreground" />
          </span>
          <h2 className="mt-6 font-display text-3xl font-extrabold md:text-4xl">
            {site?.discord_title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {site?.discord_description}
          </p>
          {site?.discord_widget_id && <DiscordWidget widgetId={site.discord_widget_id} />}
          <a
            href={site?.discord_url ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="bg-brand mt-8 inline-flex min-h-12 items-center justify-center rounded-xl px-8 text-sm font-bold tracking-wide text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.03]"
          >
            JOIN DISCORD
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function DiscordWidget({ widgetId }: { widgetId: string }) {
  return (
    <iframe
      title="Discord widget"
      src={`https://discord.com/widget?id=${encodeURIComponent(widgetId)}&theme=dark`}
      width="100%"
      height="320"
      loading="lazy"
      allowTransparency
      frameBorder="0"
      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      className="mx-auto mt-8 max-w-md rounded-2xl border border-border"
    />
  );
}

export function NewsSection({ content, limit = 3 }: { content: SiteContent; limit?: number }) {
  const posts = content.news.slice(0, limit);
  if (!posts.length) return null;
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading eyebrow="UPDATES" title="LATEST NEWS" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="glass-card glow-hover overflow-hidden"
            >
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  loading="lazy"
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="p-6">
                <p className="text-[11px] font-semibold tracking-widest text-accent">
                  {post.category.toUpperCase()}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold">{post.title}</h3>
                <p className="mt-2 line-clamp-4 text-sm text-muted-foreground">
                  {post.description}
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {new Date(post.published_at).toLocaleDateString()} · {post.author}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/news"
            className="inline-flex min-h-12 items-center rounded-xl border border-border px-6 text-sm font-semibold transition-colors hover:border-accent/60"
          >
            View all news
          </Link>
        </div>
      </div>
    </section>
  );
}
