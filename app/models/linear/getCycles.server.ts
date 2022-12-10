import { LinearClient, LinearError } from "@linear/sdk";
import type { LinearFetch, Cycle, Issue } from "@linear/sdk";
import { linearErrorCreator } from "~/lib/linearApi/linearErrorCreator";
import { unknowErrorCreator } from "~/lib/api/unknowErrorCreator";
import { sortBy } from "lodash";

const countAllPointsFromIssues = (issueNodes: Issue[]) => (
  issueNodes.reduce((prev, curr) => (curr?.estimate ?? 0) + prev, 0)
)

export async function getCycles(apiKey: string) {
  const linearClient = new LinearClient({
    apiKey,
  });

  async function getMyCycles(linearClient: LinearClient): LinearFetch<Cycle[]> {
    const graphQLClient = linearClient.client;

    const res = await graphQLClient.rawRequest<
      { cycles: { nodes: Cycle[] } },
      { last: number; cyclesFilter: any; issuesFilter: any }
    >(
      `
      query getCycles($cyclesFilter: CycleFilter, $issuesFilter: IssueFilter, $last: Int) {
        cycles(filter: $cyclesFilter, last: $last) {
          nodes {
            id
            number
            startsAt
            endsAt
            issues(filter: $issuesFilter) {
              nodes {
                id
                title
                estimate
              }
            }
          }
        }
      }`,
      {
        last: 20,
        issuesFilter: {
          estimate: {
            null: false,
          },
          assignee: {
            isMe: {
              eq: true,
            },
          },
          completedAt: {
            null: false,
          },
        },
        cyclesFilter: {
          team: {
            name: {
              eq: "Front-End",
            },
          },
        },
      }
    );

    return res.data?.cycles?.nodes ?? [];
  }

  try {
    const cycles = await getMyCycles(linearClient);

    const prepared = sortBy(cycles.map((cycle) => ({
      ...cycle,
      points: countAllPointsFromIssues(cycle.issues.nodes),
    })), 'number');

    return {
      cycles: prepared,
    };
  } catch (error) {
    const restResBody = { cycles: [] };
    if (error instanceof LinearError) {
      return linearErrorCreator(error, restResBody);
    }
    return unknowErrorCreator(restResBody);
  }
}
