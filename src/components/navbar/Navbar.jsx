import { Link } from "react-router-dom";
import { isLoggedIn } from "../../utils/authUtils";
import LoginButton from "./LoginButton";
import CreateAccountButton from "./CreateAccountButton";
import CreateListButton from "./CreateListButton";
import SearchBar from "./SearchBar"

export default function Navbar() {
  const loggedIn = isLoggedIn(); // Check if the user is logged in

  return (
    <div className="navbar bg-base-200 shadow-sm mb-4">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">
          Flicks
        </Link>
      </div>
      <SearchBar />

      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            {loggedIn ? (
              <>
                <li>
                  <CreateListButton />
                </li>
                <li>
                  <LoginButton />
                </li>
              </>
            ) : (
              <>
                <li>
                  <CreateAccountButton />
                </li>
                <li>
                  <LoginButton />
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}