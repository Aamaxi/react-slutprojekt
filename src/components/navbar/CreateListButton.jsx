import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function CreateListButton() {
  const { isLoggedIn, logout } = useAuth(); 

  if (!isLoggedIn) {
    console.log("lksdfgkjhsdfkjhfhjk")
    return;
  }
  
  return(
    <Link className="btn" to="createlist">Create list</Link>
  );
}