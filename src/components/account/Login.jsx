import { useState } from "react";
import axios from "axios";
import ProtectedComponent from "../ProtectedComponent";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", form);
      const { token, username } = response.data;      

      if (username) {
        // Save token to local storage
        localStorage.setItem("token", token);
        setUsername(username);
        setMessage("Login successful!");
      } else {
        setMessage("Login failed: Username not found.");
      }
    } catch (error) {
      setMessage("Failed to log in.");
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername(null);
    setMessage("Logged out successfully.");
  };

  return (
    <div>
      <ProtectedComponent />
      {!username ? (
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <br />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <br />
          <button type="submit">Login</button>
        </form>
      ) : (
        <div>
          <p>Welcome, {username || "Guest"}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      <p>{message}</p>
    </div>
  );
}