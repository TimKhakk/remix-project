import { json, redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import {
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { getCycles } from "~/models/linear/getCycles.server";
import { requireUser } from "~/session.server";
import {
  EMPTY_LINEAR_API_KEY_SEARCH_PARAM,
  UNKNOWN_ERROR_SEARCH_PARAM,
  WRONG_LINEAR_API_KEY_SEARCH_PARAM,
} from "../daily-standup/index";
import classNames from "classnames";
import { dateFormatter } from "~/lib/formatters/dateFormatter";

export enum TeamScope {
  FrontEnd = "Front-End",
  BackEnd = "Back-End",
}

const TEAM_SC0PE_SEARCH_PARAM_KEY = "team";

export async function loader({ request }: LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const user = await requireUser(request);

  if (!user.linearApiKey) {
    throw redirect(
      `/daily-standup/settings?${EMPTY_LINEAR_API_KEY_SEARCH_PARAM}`
    );
  }

  const teamScope = searchParams.get(TEAM_SC0PE_SEARCH_PARAM_KEY) as TeamScope ?? TeamScope.FrontEnd;

  const { cycles, errors } = await getCycles({
    apiKey: user.linearApiKey,
    teamScope,
  });

  if (errors?.type === "unknow") {
    throw redirect(`/daily-standup/settings?${UNKNOWN_ERROR_SEARCH_PARAM}`);
  }

  if (errors) {
    throw redirect(
      `/daily-standup/settings?${WRONG_LINEAR_API_KEY_SEARCH_PARAM}`
    );
  }

  return json({
    cycles,
  });
}

const TEAM_SCOPE_LIST = [TeamScope.FrontEnd, TeamScope.BackEnd];

export default function Points() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { cycles } = useLoaderData<typeof loader>();

  const handleChangeTeamScope = (scope: TeamScope) => {
    const currentScope = searchParams.get(TEAM_SC0PE_SEARCH_PARAM_KEY);
    if (scope === currentScope) return;
    setSearchParams({
      [TEAM_SC0PE_SEARCH_PARAM_KEY]: scope,
    })
  }

  const isActive = (scope: TeamScope) => {
    if (searchParams.get(TEAM_SC0PE_SEARCH_PARAM_KEY) === null) {
      return scope === TeamScope.FrontEnd;
    }
    return searchParams.get(TEAM_SC0PE_SEARCH_PARAM_KEY) === scope
  };

  return (
    <main className="grid h-full grid-cols-2 bg-app-primary-dark">
      <div className="flex h-full flex-col gap-3 border-r border-app-primary-900 p-6">
        <div className="flex items-center gap-2">
          <p>Scope:</p>
          {TEAM_SCOPE_LIST.map((scope) => (
            <button
              className={classNames(
                "flex items-center gap-3 rounded py-1 px-3 text-app-white-200 transition",
                {
                  "bg-gray-700 hover:bg-gray-600": isActive(scope),
                  "hover:bg-gray-500": !isActive(scope)
                }
              )}
              key={scope}
              onClick={() => handleChangeTeamScope(scope)}
            >
              {scope}
            </button>
          ))}
        </div>
        {cycles.map((cycle) => (
          <div
            key={cycle.id}
            className="border-b border-app-primary-900 pb-1.5"
          >
            Cycle {cycle.number} - points:{" "}
            <span className="font-bold text-yellow-200">{cycle.points}</span>
            <span className="text-sm text-gray-400">
              {" "}
              • {dateFormatter(cycle.startsAt)} - {dateFormatter(cycle.endsAt)}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
