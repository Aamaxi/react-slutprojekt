import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function LoginButton() {
  const { isLoggedIn, logout } = useAuth(); // Use AuthContext

  if (!isLoggedIn) {
    return <Link to="/login" className="btn">Log in</Link>;
  }

  return (
    <button onClick={logout} className="btn">
      Log out
    </button>
  );
}