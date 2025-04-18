import { Link } from "react-router-dom";
import { isLoggedIn } from "../../utils/authUtils";

export default function CreateAccountButton() {
  if (!isLoggedIn) {
    return;
  }
  
  return(
    <Link className="btn" to="/createaccount">Create account</Link>
  );
}