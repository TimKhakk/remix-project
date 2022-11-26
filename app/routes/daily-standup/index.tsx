import { json, redirect } from "@remix-run/node";
import type { Issue } from "@linear/sdk";
import { useLoaderData, useTransition } from "@remix-run/react";
import { useState } from "react";
import type { LoaderArgs } from "@remix-run/node";
import { requireUser } from "~/session.server";
import { getUserLinearIssuesByApiKey } from "~/models/user.server";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);

  if (!user.linearApiKey) {
    throw redirect("/daily-standup/settings");
  }

  const { issues, errors } = await getUserLinearIssuesByApiKey(
    user.linearApiKey
  );

  if (errors) {
    throw redirect("/daily-standup/settings?wrongLinearApiKey");
  }

  return json({
    issues,
  });
}

export type LightIssue = Pick<
  Issue,
  "id" | "url" | "branchName" | "identifier" | "title"
>;

type SelectedIssues = Record<"forToday" | "forYesterday", LightIssue[]>;

const CheckBox = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <label className="cursor-pointer hover:bg-gray-400 flex items-center gap-2 px-0.5 rounded">
    <input
      className="appearance-none"
      type="checkbox"
      defaultChecked={false}
      checked={checked}
      onChange={onChange}
    />
    {!checked ? (
      <i className="ri-checkbox-blank-circle-line"></i>
    ) : (
      <i className="ri-checkbox-circle-fill"></i>
    )}
    <span>{label}</span>
  </label>
);

const ROW_MAX_CHARS = 36;

export default function Index() {
  const { issues } = useLoaderData<typeof loader>();
  const { state } = useTransition();

  const [selectedIssues, setSelectedIssues] = useState<SelectedIssues>({
    forToday: [],
    forYesterday: [],
  });

  const handleCheck = (
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

  const hasSelectedIssues = Boolean(
    selectedIssues.forYesterday.length || selectedIssues.forToday.length
  );

  return (
    <main className="grid h-full grid-cols-2 bg-app-primary-dark">
      <div className="h-full border-r border-gray-400 p-6">
        <h2 className="mb-3 text-lg font-bold">Issues</h2>
        {state !== "loading" && (
          <ul>
            {issues.map((issue) => (
              <li
                key={issue.id}
                className="mb-2 flex gap-1 border-b border-gray-400 pb-2"
              >
                <CheckBox
                  label="Y"
                  checked={
                    !!selectedIssues.forYesterday.find(
                      ({ id }) => id === issue.id
                    )
                  }
                  onChange={() => handleCheck(issue, "forYesterday")}
                />
                <CheckBox
                  label="T"
                  checked={
                    !!selectedIssues.forToday.find(
                      ({ id }) => id === issue.id
                    )
                  }
                  onChange={() => handleCheck(issue, "forToday")}
                />
                <a
                  className="cursor-pointer text-blue-500 hover:text-blue-400 hover:underline"
                  href={issue.url}
                  target="_blanc"
                  rel="noopener noreferrer"
                >
                  {issue.identifier}
                </a>{" "}
                -{" "}
                {issue.title.length > ROW_MAX_CHARS
                  ? issue.title.slice(0, ROW_MAX_CHARS) + "..."
                  : issue.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex-1 p-6">
        <h2 className="mb-3 text-lg font-bold">Preview</h2>
        {state !== "loading" && hasSelectedIssues && (
          <div contentEditable="true" id="value-to-copy">
            {Boolean(selectedIssues.forYesterday.length) && (
              <strong>What did you do yesterday?</strong>
            )}
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
            {Boolean(selectedIssues.forToday.length) && (
              <strong>What are you doing today?</strong>
            )}
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
        )}
      </div>
    </main>
  );
}
