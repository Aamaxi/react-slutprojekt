import { Link } from "react-router-dom";
import { isLoggedIn } from "../../utils/authUtils";

export default function CreateListButton() {
  if (!isLoggedIn) {
    console.log("lksdfgkjhsdfkjhfhjk")
    return;
  }
  
  return(
    <Link className="btn" to="createlist">Create list</Link>
  );
}