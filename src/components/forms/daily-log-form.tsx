"use client";

import { useState, useTransition } from "react";
import { createDailyLogAction } from "@/app/(app)/projects/[projectId]/actions";
import { Field, fieldInputClass, PrimaryButton } from "@/components/ui/field";

export function DailyLogForm({ projectId, onDone }: { projectId: string; onDone: () => void }) {
  const [summary, setSummary] = useState("");
  const [crewCount, setCrewCount] = useState("");
  const [weather, setWeather] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!summary.trim() || pending) return;
    startTransition(async () => {
      await createDailyLogAction(projectId, {
        summary,
        crewCount: parseInt(crewCount, 10) || 1,
        weather,
      });
      onDone();
    });
  }

  return (
    <div>
      <Field label="Today's summary">
        <textarea
          autoFocus
          className={fieldInputClass}
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="What did the crew accomplish today?"
        />
      </Field>
      <Field label="Crew count">
        <input
          type="number"
          min={1}
          className={fieldInputClass}
          value={crewCount}
          onChange={(e) => setCrewCount(e.target.value)}
          placeholder="e.g. 5"
        />
      </Field>
      <Field label="Weather (optional)">
        <input
          className={fieldInputClass}
          value={weather}
          onChange={(e) => setWeather(e.target.value)}
          placeholder="e.g. Clear, 68°F"
        />
      </Field>
      <PrimaryButton onClick={submit} disabled={!summary.trim() || pending}>
        Add Daily Log
      </PrimaryButton>
    </div>
  );
}
