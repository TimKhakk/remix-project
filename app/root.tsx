import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import toastifyStylesUrl from "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import remixIconsStylessheetUrl from 'remixicon/fonts/remixicon.css'
import { getUser } from "./session.server";
import Header from "./components/header";
import { useOptionalUser } from "./utils";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: toastifyStylesUrl },
    { rel: "stylesheet", href: remixIconsStylessheetUrl },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

export default function App() {
  const user = useOptionalUser();
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-app-primary-dark text-app-white-200">
        {user && (
          <div className="grid pl-[280px] h-full">
            <Header />
            <Outlet />
          </div>
        )}
        {!user && (
          <Outlet />
        )}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          theme="colored"
          newestOnTop
        />
      </body>
    </html>
  );
}
