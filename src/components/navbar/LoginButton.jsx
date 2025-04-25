import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function LoginButton() {
  const { isLoggedIn, logout } = useAuth(); // Use AuthContext

  const handleLogout = () => {
    logout(); // Call the logout function
    window.location.reload(); // Refresh the page
  };

  if (!isLoggedIn) {
    return <Link to="/login" className="btn">Log in</Link>;
  }

  return (
    <button onClick={handleLogout} className="btn">
      Log out
    </button>
  );
}