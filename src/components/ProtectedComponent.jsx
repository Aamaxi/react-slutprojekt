import { isLoggedIn } from "../utils/authUtils";

export default function ProtectedComponent() {
  if (!isLoggedIn()) {
    return <p>You must be logged in to view this content.</p>;
  }

  return <p>Welcome to the protected content!</p>;
}