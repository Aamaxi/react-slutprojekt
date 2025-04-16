import { isLoggedIn } from "../../utils/authUtils";
import { Link } from "react-router-dom"; // Import Link from React Router

export default function LoginButton() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername(null);
  };
  
  if (!isLoggedIn()) {
    return(
        <Link to="/login" className="btn">Log in</Link>
      );
  }
  
  return(
    <button onClick={handleLogout} className="btn">Log out</button>
  );
}