import { json, redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";

export async function loader(_: LoaderArgs) {
  return redirect('/cycles/points')
}

export default function Index() {
  return (
    <main className="grid h-full grid-cols-2 bg-app-primary-dark">
      <div className="flex h-full flex-col gap-3 border-r border-app-primary-900 p-6"></div>

      <div className="flex-1 p-6">
        <div className="mb-3 flex min-h-[32px] items-center justify-between gap-2">
          <h2 className="text-lg font-bold">Preview</h2>
        </div>
        <div contentEditable="true" className="text-base">
          Release Notes (December 7th, Tango)
          <span className="font-bold">REconcile</span>
          Troubleshooting of incorrect create event date (-1); editing &
          promoting CE
          <span className="font-bold">REport</span>
          Bug fixes & infrastructure improvements
          <hr />
          Business Notes
          QA Notes
        </div>
      </div>
    </main>
  );
}
