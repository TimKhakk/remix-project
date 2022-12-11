import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import type { LoaderArgs } from "@remix-run/node";
import { AppNavLink } from "~/components/header";

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request);
  return json({});
}

export default function CyclesPage() {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="bg-app-primary-dark p-4 border-app-primary-900 border-b">
        <nav>
          <ul className="flex gap-3 items-center">
            {/* <AppNavLink to="./" icon="ri-hammer-line">Release Notes</AppNavLink> */}
            <AppNavLink to="./points" icon="ri-medal-line">Points</AppNavLink>
          </ul>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
