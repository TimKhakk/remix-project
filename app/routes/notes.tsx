import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { getNoteListItems } from "~/models/note.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json({ noteListItems });
}

export default function NotesPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <main className="flex h-full">
        <div className="h-full w-80 border-r border-app-primary-900">
          <Link to="new" className="block p-4 text-blue-500">
            + New Note
          </Link>

          <hr className="border-app-primary-900"/>

          {data.noteListItems.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {data.noteListItems.map((note) => (
                <li key={note.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `border-b border-app-primary-900 p-4 flex gap-2 items-center ${isActive ? "bg-app-primary-900" : ""}`
                    }
                    to={note.id}
                  >
                    <i className="ri-sticky-note-line"></i>
                    {note.title}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
