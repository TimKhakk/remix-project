import { Form, NavLink } from "@remix-run/react";
import type { ComponentProps } from "react";
import { useOptionalUser } from "~/utils";
import cn from "classnames";

interface Props extends ComponentProps<typeof NavLink> {
  children: React.ReactNode;
  icon?: string;
}

export const AppNavLink = ({
  icon = 'ri-admin-line',
  children,
  ...props
}: Props)  => {
  return (
    <li>
      <NavLink
        className={({ isActive }) => cn(
          "flex items-center gap-3 rounded py-2 px-4 text-app-white-200 transition",
          {
            "bg-gray-700 hover:bg-gray-600": isActive,
            "hover:bg-gray-500": !isActive
          }
        )}
        {...props}
      >
        <i className={cn("ri-lg", icon)}></i>
        {children}
      </NavLink>
    </li>
  );
};

export const HeaderWrapper = ({
  children,
  left = "left-0",
  width = "w-[280px]",
}: {
  children: React.ReactNode;
  left?: string;
  width?: string;
}) => (
  <header
    className={cn(
      "fixed top-0 bottom-0 flex flex-col gap-4 border-r border-app-primary-900 bg-[#031C30] p-4",
      left,
      width
    )}
  >
    <nav className="h-full">
      <ul className="flex h-full flex-col gap-4">{children}</ul>
    </nav>
  </header>
);

export default function Header() {
  const user = useOptionalUser();
  return (
    <HeaderWrapper>
      <AppNavLink icon="ri-home-line" to="/">
        Home
      </AppNavLink>
      <AppNavLink icon="ri-pen-nib-line" to="/posts">
        Posts
      </AppNavLink>
      <AppNavLink to="/posts/admin">Posts Admin</AppNavLink>
      {user && (
        <>
          <AppNavLink icon="ri-todo-line" to="/notes">
            Notes
          </AppNavLink>
          <AppNavLink icon="ri-calendar-todo-line" to="/daily-standup/">
            Daily Standup
          </AppNavLink>
        </>
      )}
      <li className="mt-auto flex items-center gap-4 rounded py-2 px-4 text-app-white-200">
        <i className="ri-lg ri-user-line"></i>
        {user?.email}
      </li>

      <li>
        <Form action="/logout" method="post" className="mt-auto">
          <button
            type="submit"
            className="flex w-full items-center gap-4 rounded py-2 px-4 text-app-white-200 transition hover:bg-gray-500"
          >
            <i className="ri-logout-box-r-line ri-lg"></i>
            Logout
          </button>
        </Form>
      </li>
    </HeaderWrapper>
  );
}
