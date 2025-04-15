import { jwtDecode } from "jwt-decode"; // Use named import

export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now(); // Check if the token is expired
    return !isExpired;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};