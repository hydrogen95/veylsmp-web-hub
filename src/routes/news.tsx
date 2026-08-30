import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { siteContentQuery } from "@/lib/site";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/Sections";

export const Route = createFileRoute("/news")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery),
  head: () => ({
    meta: [
      { title: "News & Updates — VeylSMP" },
      {
        name: "description",
        content:
          "Patch notes, events and announcements from the VeylSMP Minecraft economy survival server.",
      },
      { property: "og:title", content: "News & Updates — VeylSMP" },
      {
        property: "og:description",
        content: "Patch notes, events and announcements from VeylSMP.",
      },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const { data } = useSuspenseQuery(siteContentQuery);

  return (
    <SiteLayout>
      <section className="hero-glow relative overflow-hidden">
        <div className="grid-lines absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-14 md:px-6 md:pt-24 md:pb-20">
          <SectionHeading
            eyebrow="UPDATES"
            title="NEWS & ANNOUNCEMENTS"
            description="Everything new on VeylSMP, from patch notes to seasonal events."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.news.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
                className="glass-card glow-hover overflow-hidden"
              >
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    loading="lazy"
                    className="h-44 w-full object-cover"
                  />
                )}
                <div className="p-6">
                  <p className="text-[11px] font-semibold tracking-widest text-accent">
                    {post.category.toUpperCase()}
                  </p>
                  <h2 className="mt-2 font-display text-lg font-bold">{post.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {post.description}
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {new Date(post.published_at).toLocaleDateString()} · {post.author}
                  </p>
                </div>
              </motion.article>
            ))}
            {!data.news.length && (
              <p className="text-center text-muted-foreground md:col-span-2 lg:col-span-3">
                No news published yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
