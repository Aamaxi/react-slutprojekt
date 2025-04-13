import { Link } from "react-router-dom"; // Import Link from React Router
import LoginButton from "./LoginButton";

export default function Navbar() {
  return (
    <nav className="Navbar">
      <div className="Navbar-clickables-container">
        <button className="Navbar-hamburger-button">
          <img src="/icons/hamburger_menu.svg" alt="Hamburger Menu" />
        </button>
        <Link to="/" className="Navbar-logo-container">
          <h1 className="Navbar-header">Old Flicks</h1>
          <img src="/icons/logo.svg" alt="Logo" className="Navbar-logo" />
        </Link>
      </div>
      <div className="Navbar-links">
        <Link to="/" className="Navbar-link">Home</Link>
        <Link to="/film" className="Navbar-link">Films</Link>
        <Link to="/list" className="Navbar-link">Lists</Link>
        <Link to="/account" className="Navbar-link">Account</Link>
        <Link to="/person" className="Navbar-link">People</Link>
      </div>
      <LoginButton />
    </nav>
  );
}