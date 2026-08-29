import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, Blocks, MessagesSquare } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteContentQuery } from "@/lib/site";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const { data } = useSuspenseQuery(siteContentQuery);
  const [open, setOpen] = useState(false);
  const nav = data.navigation;
  const discord = data.site?.discord_url ?? "#";
  const brand = data.site?.hero_title ?? "VeylSMP";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            {data.site?.logo_url ? (
              <img src={data.site.logo_url} alt={`${brand} logo`} className="size-8 rounded-lg" />
            ) : (
              <span className="bg-brand flex size-8 items-center justify-center rounded-lg">
                <Blocks className="size-4 text-primary-foreground" />
              </span>
            )}
            <span className="font-display text-lg font-extrabold tracking-tight">{brand}</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) =>
              item.href.startsWith("http") ? (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.id}
                  to={item.href}
                  activeProps={{ className: "text-foreground" }}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ),
            )}
            <a
              href={discord}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Discord
            </a>
            <Link
              to="/server"
              className="bg-brand ml-2 inline-flex min-h-10 items-center rounded-xl px-4 text-sm font-bold tracking-wide text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.03]"
            >
              PLAY NOW
            </Link>
          </nav>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-11 items-center justify-center rounded-xl border border-border md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-border bg-background md:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-4">
                {nav.map((item) =>
                  item.href.startsWith("http") ? (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-4 py-3 text-base font-medium text-muted-foreground"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.id}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-4 py-3 text-base font-medium text-muted-foreground"
                    >
                      {item.label}
                    </Link>
                  ),
                )}
                <a
                  href={discord}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl px-4 py-3 text-base font-medium text-muted-foreground"
                >
                  Discord
                </a>
                <Link
                  to="/server"
                  onClick={() => setOpen(false)}
                  className="bg-brand mt-2 inline-flex min-h-12 items-center justify-center rounded-xl text-base font-bold text-primary-foreground"
                >
                  PLAY NOW
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>{children}</main>

      <footer className="border-t border-border bg-surface/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="font-display text-lg font-extrabold">{brand}</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {data.server?.description ?? ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {nav.slice(0, 5).map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={discord}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <MessagesSquare className="size-4" /> Discord
            </a>
          </div>
        </div>
        <div className="border-t border-border/60 px-4 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {brand}. Not affiliated with Mojang or Microsoft.
        </div>
      </footer>
    </div>
  );
}
