import { json } from "@remix-run/node";
import { useUser } from "~/utils";
import { Form, Link, Outlet } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import type { LoaderArgs } from "@remix-run/node";
import type { Issue } from "@linear/sdk";

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request);
  return json({});
}

export type LightIssue = Pick<
  Issue,
  "id" | "url" | "branchName" | "identifier" | "title"
>;

export default function NotesPage() {
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">
            <Link to="/">Home</Link>
          </h1>
          <h1 className="text-3xl font-bold">
            <Link to=".">Daily Standup</Link>
          </h1>
          <h1 className="text-3xl font-bold">
            <Link to="./settings">Settings</Link>
          </h1>
        </div>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <Outlet />
    </div>
  );
}