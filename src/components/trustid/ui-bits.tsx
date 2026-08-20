import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { statusMeta, type CredentialStatus } from "@/lib/trustid-data";

export function StatusPill({
  status,
  className,
}: {
  status: CredentialStatus;
  className?: string;
}) {
  const meta = statusMeta[status];
  const tones: Record<string, string> = {
    success: "bg-success/12 text-success border-success/25",
    warning: "bg-warning/18 text-warning-foreground border-warning/40",
    destructive: "bg-destructive/10 text-destructive border-destructive/25",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        tones[meta.tone],
        className,
      )}
    >
      <span aria-hidden>{meta.mark}</span>
      {meta.label}
    </span>
  );
}

export function ScoreRing({ value, size = 64 }: { value: number; size?: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r={r} className="fill-none stroke-muted" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={r}
          className="fill-none stroke-primary"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * value) / 100}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-bold text-primary">
        {value}%
      </span>
    </div>
  );
}

export function QrArt({ className }: { className?: string }) {
  const cells = Array.from({ length: 169 }, (_, i) => {
    const x = i % 13;
    const y = Math.floor(i / 13);
    const finder =
      (x < 3 && y < 3) || (x > 9 && y < 3) || (x < 3 && y > 9)
        ? true
        : (x * 7 + y * 13 + x * y) % 3 === 0;
    return finder;
  });
  return (
    <div
      className={cn("grid aspect-square w-full gap-[2px] rounded-xl bg-card p-3", className)}
      style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))" }}
      aria-label="Mã QR xác minh hồ sơ"
      role="img"
    >
      {cells.map((on, i) => (
        <span
          key={i}
          className={cn("aspect-square rounded-[2px]", on ? "bg-ink" : "bg-transparent")}
        />
      ))}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  desc,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
      ) : null}
      <h2 className="mt-1 text-2xl font-bold text-foreground">{title}</h2>
      {desc ? <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{desc}</p> : null}
    </div>
  );
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[400px]">
      <div className="rounded-[2.5rem] border border-border bg-ink p-2.5 shadow-lift">
        <div className="relative h-[760px] overflow-hidden rounded-[2rem] bg-background">
          <div className="absolute left-1/2 top-2 z-30 h-6 w-28 -translate-x-1/2 rounded-full bg-ink" />
          <div className="h-full overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
