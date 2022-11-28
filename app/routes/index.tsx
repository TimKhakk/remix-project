import { Link, Outlet } from "@remix-run/react";
import { TechStack } from "~/components/home/dumbJSX";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <div className="">
      <main className="relative min-h-screen  sm:flex sm:items-center sm:justify-center">
        <div className="relative sm:pb-16 sm:pt-8">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative sm:overflow-hidden sm:rounded-2xl">
              <div className="absolute inset-0">
                <div className="absolute" />
              </div>
              <div className="relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pb-20 lg:pt-32">
                <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-4xl">
                  <span className="block uppercase text-white drop-shadow-md">
                    Daily Standup Builder
                  </span>
                </h1>
                {/* <a className="bg-black" href="https://remix.run">
                  <img
                    src="https://user-images.githubusercontent.com/1500684/158298926-e45dafff-3544-4b69-96d6-d3bcc33fc76a.svg"
                    alt="Remix"
                    className="mx-auto w-full max-w-[12rem] md:max-w-[16rem]"
                  />
                </a> */}
                <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                  {user ? (
                    <Link
                      to="/daily-standup/"
                      className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-gray-200 sm:px-8"
                    >
                      View daily standup builder for {user.email}
                    </Link>
                  ) : (
                    <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                      <Link
                        to="/join"
                        className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 transition text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                      >
                        Sign up
                      </Link>
                      <Link
                        to="/login"
                        className="flex items-center justify-center rounded-md bg-app-primary-900 px-4 py-3 font-medium text-white transition hover:bg-app-primary-700"
                      >
                        Log In
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* <TechStack /> */}
        </div>
      </main>
      <Outlet />
    </div>
  );
}
