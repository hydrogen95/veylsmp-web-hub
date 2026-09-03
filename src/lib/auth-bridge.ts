import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

/**
 * Google sign-in is brokered by Lovable and only accepts redirects back to
 * Lovable-hosted origins. When the site runs on another host (Vercel, a custom
 * domain), we sign in on the Lovable origin and hand the session back.
 */
export const BRIDGE_ORIGIN = "https://veylsmp-web-hub.lovable.app";

/** Origins the bridge is allowed to hand a session back to (exact match). */
export const ALLOWED_RETURN_ORIGINS = [
  "https://veylsmp-web-hub.vercel.app",
  "https://veylsmp.cubyn.xyz",
  "https://www.veylsmp.cubyn.xyz",
];

export function isBrokerOrigin() {
  if (typeof window === "undefined") return true;
  const host = window.location.hostname;
  return (
    host.endsWith(".lovable.app") ||
    host.endsWith(".lovable.dev") ||
    host === "localhost" ||
    host === "127.0.0.1"
  );
}

export function safeNextPath(value: string | null | undefined, fallback = "/account") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

/** Starts Google sign-in from any origin. Returns an error message on failure. */
export async function signInWithGoogle(nextPath: string): Promise<string | null> {
  if (typeof window === "undefined") return null;

  if (!isBrokerOrigin()) {
    const url = new URL("/auth/bridge", BRIDGE_ORIGIN);
    url.searchParams.set("return", window.location.origin);
    url.searchParams.set("next", nextPath);
    window.location.href = url.toString();
    return null;
  }

  const res = await lovable.auth.signInWithOAuth("google", {
    redirect_uri: `${window.location.origin}${nextPath}`,
  });
  if (res && "error" in res && res.error) return res.error.message;
  return null;
}

/** Picks up a session handed over by the bridge and cleans the URL. */
export async function consumeBridgeSession(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash.includes("veyl_at=")) return false;

  const params = new URLSearchParams(hash);
  const access_token = params.get("veyl_at");
  const refresh_token = params.get("veyl_rt");
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
  if (!access_token || !refresh_token) return false;

  const { error } = await supabase.auth.setSession({ access_token, refresh_token });
  return !error;
}
