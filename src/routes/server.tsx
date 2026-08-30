import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteContentQuery } from "@/lib/site";
import { SiteLayout } from "@/components/site/SiteLayout";
import { StatusCard } from "@/components/site/StatusCard";
import {
  ConnectionCard,
  CrossplaySection,
  HowToJoinSection,
  SectionHeading,
  ServerInfoSection,
} from "@/components/site/Sections";

export const Route = createFileRoute("/server")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery),
  head: () => ({
    meta: [
      { title: "Join the Server — VeylSMP IP & Status" },
      {
        name: "description",
        content:
          "VeylSMP server address, live player count and step-by-step instructions for joining on Java or Bedrock.",
      },
      { property: "og:title", content: "Join the Server — VeylSMP IP & Status" },
      {
        property: "og:description",
        content: "VeylSMP server address, live status and how to join on Java or Bedrock.",
      },
    ],
  }),
  component: ServerPage,
});

function ServerPage() {
  const { data } = useSuspenseQuery(siteContentQuery);

  return (
    <SiteLayout>
      <section className="hero-glow relative overflow-hidden">
        <div className="grid-lines absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-10 md:px-6 md:pt-24">
          <SectionHeading
            eyebrow="CONNECT"
            title="JOIN VEYLSMP"
            description="Copy the address below and hop in — Java and Bedrock share the same world."
          />
          <div className="mt-10 space-y-6">
            {data.server?.show_status !== false && <StatusCard server={data.server} />}
            <ConnectionCard content={data} />
          </div>
        </div>
      </section>

      <CrossplaySection content={data} />
      <ServerInfoSection content={data} />
      <HowToJoinSection content={data} />
    </SiteLayout>
  );
}
