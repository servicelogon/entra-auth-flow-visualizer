"use client";

import { ARTIFACTS_BY_ID } from "@/lib/tokens";
import type { ArtifactStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type TrayItem = {
  id: string;
  status: ArtifactStatus;
};

export function TokenTray({
  items,
  selectedId,
  onSelect,
}: {
  items: TrayItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center">
        <p className="font-medium">No tickets yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Play a scenario. Codes, tokens, and cookies will land here as they are
          created.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => {
        const artifact = ARTIFACTS_BY_ID[item.id];
        const selected = selectedId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              "rounded-2xl border px-3 py-3 text-left transition-all",
              selected
                ? "border-magenta bg-magenta-soft"
                : "border-border bg-white hover:border-foreground/20"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="flex items-center gap-2">
                <span
                  className="mt-0.5 size-2.5 rounded-full"
                  style={{ backgroundColor: artifact.color }}
                />
                <span className="font-medium">{artifact.label}</span>
              </span>
              <Badge
                variant={item.status === "live" ? "secondary" : "outline"}
                className={cn(
                  item.status === "expired" && "text-destructive",
                  item.status === "consumed" && "text-muted-foreground"
                )}
              >
                {item.status}
              </Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {artifact.lifetime} · tap to inspect
            </p>
          </button>
        );
      })}
    </div>
  );
}
