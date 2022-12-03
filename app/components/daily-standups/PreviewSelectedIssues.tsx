import { forwardRef } from "react";

interface Props {
  selectedIssues: {
    forYesterday: any[];
    forToday: any[];
  };
}

export const PreviewSelectedIssues = forwardRef(
  ({ selectedIssues }: Props, contentRef: React.LegacyRef<HTMLDivElement>) => {
    const isForYesterdayChecked = Boolean(selectedIssues.forYesterday.length);
    const isForTodayChecked = Boolean(selectedIssues.forToday.length);

    return (
      <div contentEditable="true" className="text-base" ref={contentRef}>
        {isForYesterdayChecked && <strong>What did you do yesterday?</strong>}
        <ul className="list-disc pl-4">
          {selectedIssues.forYesterday.map((issue) => (
            <li key={issue.id}>
              <a
                className="cursor-pointer text-blue-500 hover:text-blue-400 hover:underline"
                href={issue.url}
              >
                {issue.identifier}
              </a>{" "}
              - {issue.title}
            </li>
          ))}
        </ul>
        {isForTodayChecked && <strong>What are you doing today?</strong>}
        <ul className="list-disc pl-4">
          {selectedIssues.forToday.map((issue) => (
            <li key={issue.id}>
              <a
                className="cursor-pointer text-blue-500 hover:text-blue-400 hover:underline"
                href={issue.url}
              >
                {issue.identifier}
              </a>{" "}
              - {issue.title}
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

PreviewSelectedIssues.displayName = "PreviewSelectedIssues";
