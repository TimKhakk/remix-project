import { json, redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { getCycles } from "~/models/linear/getCycles.server";
import { requireUser } from "~/session.server";
import {
  EMPTY_LINEAR_API_KEY_SEARCH_PARAM,
  UNKNOWN_ERROR_SEARCH_PARAM,
  WRONG_LINEAR_API_KEY_SEARCH_PARAM,
} from "./index";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);

  if (!user.linearApiKey) {
    throw redirect(
      `/daily-standup/settings?${EMPTY_LINEAR_API_KEY_SEARCH_PARAM}`
    );
  }

  const { cycles, errors } = await getCycles(user.linearApiKey);

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

const dateFormatter = (date: string) => dayjs(date).format("MMM D");

export default function Points() {
  const { cycles } = useLoaderData<typeof loader>();

  return (
    <main className="grid h-full grid-cols-2 bg-app-primary-dark">
      <div className="flex h-full flex-col gap-3 border-r border-app-primary-900 p-6">
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
