import { forwardRef } from "react";
import type { LightIssue } from "~/routes/daily-standup";

interface Props {
  selectedIssues: {
    forYesterday: LightIssue[];
    forToday: LightIssue[];
  };
}

const PreviewItem = ({ url, identifier, title }: LightIssue) => (
  <li className="text-base">
    <a
      href={url}
      className="cursor-pointer text-blue-500 hover:text-blue-400 hover:underline"
    >
      {identifier}
    </a>{" "}
    - {title}
  </li>
);

export const PreviewSelectedIssues = forwardRef(
  ({ selectedIssues }: Props, contentRef: React.LegacyRef<HTMLDivElement>) => {
    const isForYesterdayChecked = Boolean(selectedIssues.forYesterday.length);
    const isForTodayChecked = Boolean(selectedIssues.forToday.length);

    return (
      <div contentEditable="true" className="text-base" ref={contentRef}>
        {isForYesterdayChecked && <strong>What did you do yesterday?</strong>}
        <ul className="list-disc pl-4 text-base">
          {selectedIssues.forYesterday.map((issue) => (
            <PreviewItem key={issue.id} {...issue}/>
          ))}
        </ul>
        {isForTodayChecked && <strong>What are you doing today?</strong>}
        <ul className="list-disc pl-4 text-base">
          {selectedIssues.forToday.map((issue) => (
            <PreviewItem key={issue.id} {...issue}/>
          ))}
        </ul>
      </div>
    );
  }
);

PreviewSelectedIssues.displayName = "PreviewSelectedIssues";
