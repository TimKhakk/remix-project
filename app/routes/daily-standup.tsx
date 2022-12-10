import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import type { LoaderArgs } from "@remix-run/node";
import type { Issue } from "@linear/sdk";
import { AppNavLink } from "~/components/header";

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request);
  return json({});
}

export type LightIssue = Pick<
  Issue,
  "id" | "url" | "branchName" | "identifier" | "title"
>;

export default function NotesPage() {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="bg-app-primary-dark p-4 border-app-primary-900 border-b">
        <nav>
          <ul className="flex gap-3 items-center">
            <AppNavLink to="./" icon="ri-hammer-line">Builder</AppNavLink>
            <AppNavLink to="./points" icon="ri-play-circle-line">Points</AppNavLink>
            <AppNavLink to="./settings" icon="ri-settings-5-line">Settings</AppNavLink>
          </ul>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
