import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteContentQuery } from "@/lib/site";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DiscordSection, RanksSection, SectionHeading } from "@/components/site/Sections";

export const Route = createFileRoute("/ranks")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery),
  head: () => ({
    meta: [
      { title: "Ranks & Store — VeylSMP Perks" },
      {
        name: "description",
        content:
          "Browse VeylSMP ranks and store packages. Support the server and unlock cosmetics, kits and economy perks.",
      },
      { property: "og:title", content: "Ranks & Store — VeylSMP Perks" },
      {
        property: "og:description",
        content: "Support VeylSMP and unlock in-game perks with our ranks and store packages.",
      },
    ],
  }),
  component: RanksPage,
});

function RanksPage() {
  const { data } = useSuspenseQuery(siteContentQuery);

  return (
    <SiteLayout>
      <section className="hero-glow relative overflow-hidden">
        <div className="grid-lines absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-2 md:px-6 md:pt-24">
          <SectionHeading
            eyebrow="STORE"
            title="RANKS & PACKAGES"
            description="Every purchase keeps VeylSMP online. Perks apply instantly in-game."
          />
        </div>
      </section>
      <RanksSection content={data} />
      <DiscordSection content={data} />
    </SiteLayout>
  );
}
