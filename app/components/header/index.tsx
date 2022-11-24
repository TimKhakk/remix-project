import { Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

export default function Header() {
  const user = useOptionalUser();
  return (
    <header>
      <nav className="container mx-auto mt-8">
        <ul className="flex gap-3">
          <li>
            <Link to="/posts" className="text-xl text-blue-600 underline">
              Blog Posts
            </Link>
          </li>
          <li>
            <Link to="/posts/admin" className="text-xl text-blue-600 underline">
              Posts Admin
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link to="/notes" className="text-xl text-blue-600 underline">
                  Notes
                </Link>
              </li>

              <li>
                <Link
                  to="/daily-standup"
                  className="text-xl text-blue-600 underline"
                >
                  Daily Standup
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
