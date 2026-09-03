import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { ALLOWED_RETURN_ORIGINS, safeNextPath } from "@/lib/auth-bridge";

export const Route = createFileRoute("/auth/bridge")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Signing in — VeylSMP" },
      { name: "description", content: "Completing VeylSMP sign-in." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Signing in — VeylSMP" },
      { property: "og:description", content: "Completing VeylSMP sign-in." },
    ],
  }),
  component: BridgePage,
});

const STORAGE_KEY = "veyl-auth-bridge";

function BridgePage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const url = new URL(window.location.href);
      const incomingReturn = url.searchParams.get("return");
      const incomingNext = url.searchParams.get("next");

      if (incomingReturn) {
        if (!ALLOWED_RETURN_ORIGINS.includes(incomingReturn)) {
          setError(`This domain is not allowed to sign in: ${incomingReturn}`);
          return;
        }
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ origin: incomingReturn, next: safeNextPath(incomingNext) }),
        );
      }

      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setError("Missing sign-in target. Start again from your site.");
        return;
      }
      const target = JSON.parse(stored) as { origin: string; next: string };
      if (!ALLOWED_RETURN_ORIGINS.includes(target.origin)) {
        setError("This domain is not allowed to sign in.");
        return;
      }

      const { data } = await supabase.auth.getSession();
      let session = data.session;

      if (!session) {
        const res = await lovable.auth.signInWithOAuth("google", {
          redirect_uri: `${window.location.origin}/auth/bridge`,
        });
        if (res && "error" in res && res.error) {
          setError(res.error.message);
          return;
        }
        if (res && "redirected" in res && res.redirected) return;
        session = (await supabase.auth.getSession()).data.session;
      }

      if (!session) {
        setError("Sign-in did not complete. Please try again.");
        return;
      }

      sessionStorage.removeItem(STORAGE_KEY);
      if (cancelled) return;
      const hash = new URLSearchParams({
        veyl_at: session.access_token,
        veyl_rt: session.refresh_token,
      });
      window.location.replace(`${target.origin}${safeNextPath(target.next)}#${hash.toString()}`);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="hero-glow flex min-h-screen items-center justify-center bg-background px-4">
      <div className="glass-card w-full max-w-md p-8 text-center">
        {error ? (
          <>
            <h1 className="font-display text-xl font-extrabold">SIGN-IN FAILED</h1>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto size-6 animate-spin text-accent" />
            <h1 className="mt-4 font-display text-xl font-extrabold">SIGNING YOU IN…</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Redirecting you back to VeylSMP.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
