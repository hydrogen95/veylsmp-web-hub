import { queryOptions } from "@tanstack/react-query";
import { getSiteContent } from "./content.functions";
import { getMinecraftStatus } from "./minecraft.functions";
import * as Icons from "lucide-react";
import type { ComponentType } from "react";

export const siteContentQuery = queryOptions({
  queryKey: ["site-content"],
  queryFn: () => getSiteContent(),
  staleTime: 30_000,
});

export function statusQuery(host: string, port: string, refreshSeconds: number, bedrock = false) {
  return queryOptions({
    queryKey: ["mc-status", host, port, bedrock],
    queryFn: () => getMinecraftStatus({ data: { host, port, bedrock } }),
    refetchInterval: Math.max(30, refreshSeconds || 45) * 1000,
    staleTime: Math.max(30, refreshSeconds || 45) * 1000,
    refetchOnWindowFocus: false,
  });
}

export function icon(name: string | null | undefined): ComponentType<{ className?: string }> {
  const map = Icons as unknown as Record<string, ComponentType<{ className?: string }>>;
  return map[name ?? ""] ?? Icons.Sparkles;
}

const currencySymbols: Record<string, string> = {
  PHP: "₱",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export function formatPrice(price: number, currency: string) {
  const symbol = currencySymbols[currency?.toUpperCase() ?? ""] ?? "";
  const value = Number(price ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return symbol ? `${symbol}${value}` : `${value} ${currency ?? ""}`.trim();
}

export function fullAddress(ip: string | undefined | null, port: string | undefined | null) {
  return port ? `${ip ?? ""}:${port}` : (ip ?? "");
}

export function isSectionVisible(sections: unknown, key: string) {
  if (!Array.isArray(sections)) return true;
  const found = (sections as Array<{ key?: string; visible?: boolean }>).find(
    (s) => s?.key === key,
  );
  return found ? found.visible !== false : true;
}
