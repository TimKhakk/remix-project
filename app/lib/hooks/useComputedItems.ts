import { useMemo } from "react";
import { lowerCase, words } from "lodash";
import { Sort } from "./useSort";
import type { LightIssue, IssueType } from "~/routes/daily-standup";

const searchStrInSource = (searchValue: string, sourceString: string) => {
  const searchWords = words(lowerCase(searchValue));

  const res = searchWords.some((word) => {
    return lowerCase(sourceString).includes(word);
  })

  return res;
}

interface Params {
  issues: LightIssue[];
  sort: Sort;
  searchQuery: string;
  filters: {
    type: IssueType;
  }
}

export function useComputedItems({
  issues,
  sort,
  searchQuery,
  filters,
}: Params) {
  const computedIssues = useMemo(() => {
    let filteredByType = [...issues];

    if (filters.type !== 'none') {
      filteredByType = issues.filter(({ title }) => {
        return lowerCase(title).includes(filters.type)
      })
    }

    if (searchQuery === "" || searchQuery.length < 3) {
      if (sort === Sort.Desc) {
        return [...filteredByType].reverse();
      }
      return filteredByType;
    };

    const res = filteredByType.filter(({ branchName, identifier, title, url }) => {

      const propsToSearch = [branchName, identifier, title, url];

      const propsIncluded = propsToSearch.map((prop) => searchStrInSource(searchQuery, prop));

      return propsIncluded.includes(true);
    })

    if (sort === Sort.Desc) {
      return [...res].reverse();
    }

    return res;
  }, [issues, searchQuery, filters.type, sort]);

  return computedIssues;
}
