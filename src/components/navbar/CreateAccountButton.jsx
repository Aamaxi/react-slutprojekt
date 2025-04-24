import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


export default function CreateAccountButton() {
  const { isLoggedIn, logout } = useAuth(); 

  if (!logout) {
    return;
  }
  
  return(
    <Link className="btn" to="/createaccount">Create account</Link>
  );
}