import { useState } from "react";
import type { LightIssue } from "~/routes/daily-standup";

type SelectedIssues = Record<"forToday" | "forYesterday", LightIssue[]>

export function useSelectedIssues() {

  const [selectedIssues, setSelectedIssues] = useState<SelectedIssues>({
    forToday: [],
    forYesterday: [],
  });

  const handleSelect = (
    issue: LightIssue,
    whenKey: keyof typeof selectedIssues
  ) => {
    const currentIssues = selectedIssues[whenKey];
    const isSelected = currentIssues.find(
      (i) => i.identifier === issue.identifier
    );

    const updatedIssues = isSelected
      ? currentIssues.filter((i) => i.identifier !== issue.identifier)
      : [...currentIssues, issue];

    setSelectedIssues((prev) => ({
      ...prev,
      [whenKey]: updatedIssues,
    }));
  };

  const handleClear = () => {
    setSelectedIssues({
      forToday: [],
      forYesterday: [],
    });
  };

  return {
    selectedIssues,
    handleSelect,
    handleClear,
  }
}
