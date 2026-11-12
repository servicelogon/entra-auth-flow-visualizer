import { ARTIFACTS_BY_ID } from "./tokens";
import type { ActorId, ArtifactStatus, FlowStep } from "./types";

export type StageItem = {
  id: string;
  status: ArtifactStatus;
  holder: ActorId;
  changed: boolean;
};

export function computeStage(
  starting: string[],
  steps: FlowStep[],
  stepIndex: number
): StageItem[] {
  const map = new Map<string, ArtifactStatus>();
  for (const id of starting) {
    map.set(id, "live");
  }
  const applied = stepIndex < 0 ? [] : steps.slice(0, stepIndex + 1);
  for (const step of applied) {
    for (const event of step.artifacts) {
      if (event.action === "add" || event.action === "replace") {
        map.set(event.artifactId, "live");
      } else if (event.action === "remove") {
        map.set(event.artifactId, "consumed");
      } else if (event.action === "expire") {
        map.set(event.artifactId, "expired");
      }
    }
  }
  const changed = new Set(
    stepIndex < 0 ? [] : steps[stepIndex].artifacts.map((event) => event.artifactId)
  );

  return Array.from(map.entries()).flatMap(([id, status]) => {
    if (status !== "live" && !changed.has(id)) {
      return [];
    }
    const artifact = ARTIFACTS_BY_ID[id];
    if (!artifact) {
      return [];
    }
    return [
      {
        id,
        status,
        holder: artifact.heldBy,
        changed: changed.has(id),
      },
    ];
  });
}
