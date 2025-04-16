import { useState } from "react";
import axios from "axios";

export default function LoginForm() {
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
    <div className="flex justify-center items-center min-h-screen bg-base-100">
      {!username ? (
        <form
          onSubmit={handleSubmit}
          className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box"
        >
          <legend className="fieldset-legend text-lg font-bold mb-4">Login</legend>

          <label className="fieldset-label block mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="input input-bordered w-full mb-4"
            placeholder="Email"
            required
          />

          <label className="fieldset-label block mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="input input-bordered w-full mb-4"
            placeholder="Password"
            required
          />

          <button type="submit" className="btn btn-neutral w-full">
            Login
          </button>
        </form>
      ) : (
        <div className="text-center">
          <p className="mb-4">Welcome, {username || "Guest"}!</p>
          <button onClick={handleLogout} className="btn btn-neutral">
            Logout
          </button>
        </div>
      )}
      <p className="mt-4 text-center text-sm text-error">{message}</p>
    </div>
  );
}