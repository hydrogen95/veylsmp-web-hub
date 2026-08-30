import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { siteContentQuery } from "@/lib/site";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/Sections";

export const Route = createFileRoute("/rules")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery),
  head: () => ({
    meta: [
      { title: "Server Rules — VeylSMP" },
      {
        name: "description",
        content:
          "Read the VeylSMP server rules covering griefing, cheating, chat conduct and fair play before you join.",
      },
      { property: "og:title", content: "Server Rules — VeylSMP" },
      {
        property: "og:description",
        content: "The rules that keep VeylSMP fair, friendly and cheat-free.",
      },
    ],
  }),
  component: RulesPage,
});

function RulesPage() {
  const { data } = useSuspenseQuery(siteContentQuery);

  return (
    <SiteLayout>
      <section className="hero-glow relative overflow-hidden">
        <div className="grid-lines absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 pt-16 pb-14 md:px-6 md:pt-24 md:pb-20">
          <SectionHeading
            eyebrow="COMMUNITY"
            title="SERVER RULES"
            description="Breaking these can lead to a mute, kick or permanent ban."
          />

          <div className="mt-10 space-y-4">
            {data.rules.map((rule, i) => (
              <motion.article
                key={rule.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card glow-hover flex gap-4 p-5 md:p-6"
              >
                <span className="bg-brand flex size-10 shrink-0 items-center justify-center rounded-xl">
                  <ShieldCheck className="size-5 text-primary-foreground" />
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-bold">
                    {i + 1}. {rule.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {rule.content}
                  </p>
                </div>
              </motion.article>
            ))}
            {!data.rules.length && (
              <p className="text-center text-muted-foreground">No rules published yet.</p>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
