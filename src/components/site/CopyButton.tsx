import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  label = "COPY IP",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const el = document.createElement("textarea");
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
    setCopied(true);
    toast.success("IP copied!", { description: value });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface-2/70 px-5 text-sm font-semibold tracking-wide text-foreground transition-colors hover:border-accent/60 hover:bg-surface-2 active:scale-[0.98]",
        className,
      )}
    >
      {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4 text-accent" />}
      {copied ? "IP copied!" : label}
    </button>
  );
}
