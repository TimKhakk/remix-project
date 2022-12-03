import { json, redirect } from "@remix-run/node";
import type { Issue } from "@linear/sdk";
import { useLoaderData, useTransition } from "@remix-run/react";
import { useRef, useState } from "react";
import type { LoaderArgs } from "@remix-run/node";
import { requireUser } from "~/session.server";
import { getUserLinearIssuesByApiKey } from "~/models/user.server";
import { Button } from "~/components/shared/Button";
import { CheckBox } from "~/components/shared/Checkbox";
import { useComputedItems } from "~/lib/hooks/useComputedItems";
import { useSort } from "~/lib/hooks/useSort";
import { useSelectedIssues } from "~/lib/hooks/useSelectedIssues";
import { truncate } from "lodash";
import { PreviewSelectedIssues } from "~/components/daily-standups/PreviewSelectedIssues";

export const EMPTY_LINEAR_API_KEY_SEARCH_PARAM = "emptyLinearApiKey";
export const WRONG_LINEAR_API_KEY_SEARCH_PARAM = "wrongLinearApiKey";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);

  if (!user.linearApiKey) {
    throw redirect(
      `/daily-standup/settings?${EMPTY_LINEAR_API_KEY_SEARCH_PARAM}`
    );
  }

  const { issues, errors } = await getUserLinearIssuesByApiKey(
    user.linearApiKey
  );

  if (errors) {
    throw redirect(
      `/daily-standup/settings?${WRONG_LINEAR_API_KEY_SEARCH_PARAM}`
    );
  }

  return json({
    issues,
  });
}

export type LightIssue = Pick<
  Issue,
  "id" | "url" | "branchName" | "identifier" | "title"
>;

export type SelectedIssues = Record<"forToday" | "forYesterday", LightIssue[]>;
export type IssueType = "chore" | "bug" | "none";

const ROW_MAX_CHARS = 40;

export default function Index() {
  const { issues } = useLoaderData<typeof loader>();
  const { state } = useTransition();
  const contentRef = useRef<HTMLDivElement>();
  const [sort, handleToggleSort] = useSort();
  const [issueType, setIssueType] = useState<IssueType>('none');
  const [searchQuery, setSearchValue] = useState("");

  const { selectedIssues, handleClear, handleSelect } = useSelectedIssues();

  const computedIssues = useComputedItems({
    issues,
    sort,
    searchQuery,
    filters: {
      type: issueType,
    },
  });

  const handleClearFilterAndSearch = () => {
    setSearchValue("");
    setIssueType('none');
  };

  const hasSelectedIssues = Boolean(
    selectedIssues.forYesterday.length || selectedIssues.forToday.length
  );

  const contentShown = state !== "loading" && hasSelectedIssues;
  const isForYesterdayChecked = Boolean(selectedIssues.forYesterday.length);
  const isForTodayChecked = Boolean(selectedIssues.forToday.length);
  const isAnyIssueChecked = isForTodayChecked || isForYesterdayChecked;

  return (
    <main className="grid h-full grid-cols-2 bg-app-primary-dark">
      <div className="flex h-full flex-col gap-3 border-r border-app-primary-900 p-6">
        <div className="flex min-h-[32px] items-center justify-between gap-2">
          <h2 className="text-lg font-bold">Issues</h2>

          {isAnyIssueChecked && (
            <Button onClick={handleClear} className="flex items-center gap-1">
              <i className="ri-checkbox-indeterminate-line"></i>
              Uncheck all
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between gap-3">
          <Button
            onClick={handleToggleSort}
            className="flex items-center gap-1"
          >
            <i className={`ri-sort-${sort}`}></i>
          </Button>
          <label className="rounded bg-app-primary-900 px-2 py-1">
            <select
              defaultValue="none"
              value={issueType}
              className="min-w-max bg-transparent px-2 py-1"
              onChange={({ target }) => {
                setIssueType(() => target.value as IssueType);
              }}
            >
              <option value="none"></option>
              <option value="chore">Chore</option>
              <option value="bug">Bug</option>
            </select>
          </label>
          <label className="flex items-center gap-1 rounded border border-white bg-transparent px-2 py-1 focus-visible:border-app-primary-500 focus-visible:outline-none">
            <i className="ri-search-line"></i>
            <input
              className="border-none bg-transparent focus-visible:outline-none"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </label>
        </div>
        {state !== "loading" && (
          <ul>
            {computedIssues.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-1 text-lg py-2">
                <span className="">No match issues</span>
                <button
                  onClick={handleClearFilterAndSearch}
                  className="cursor-pointer border-none p-0 text-app-primary-500 underline transition hover:text-app-primary-300"
                >
                  clear filter and search
                </button>
              </div>
            )}
            {computedIssues.map((issue) => (
              <li
                key={issue.id}
                className="mb-2 flex gap-1 border-b border-app-primary-900 pb-2"
              >
                <CheckBox
                  label="Y"
                  checked={
                    !!selectedIssues.forYesterday.find(
                      ({ id }) => id === issue.id
                    )
                  }
                  onChange={() => handleSelect(issue, "forYesterday")}
                />
                <CheckBox
                  label="T"
                  checked={
                    !!selectedIssues.forToday.find(({ id }) => id === issue.id)
                  }
                  onChange={() => handleSelect(issue, "forToday")}
                />
                <a
                  className="cursor-pointer text-blue-500 hover:text-blue-400 hover:underline"
                  href={issue.url}
                  target="_blanc"
                  rel="noopener noreferrer"
                >
                  {issue.identifier}
                </a>{" "}
                - {truncate(issue.title, { length: ROW_MAX_CHARS })}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex-1 p-6">
        <div className="mb-3 flex min-h-[32px] items-center justify-between gap-2">
          <h2 className="text-lg font-bold">Preview</h2>
        </div>
        {contentShown && (
          <PreviewSelectedIssues ref={contentRef} selectedIssues={selectedIssues} />
        )}
      </div>
    </main>
  );
}
