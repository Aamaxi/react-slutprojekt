import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace with your backend endpoint
      console.log("FORM", form);
      const response = await axios.post("http://localhost:5000/login", form);
      setMessage("Login successful!");
    } catch (error) {
      setMessage("Failed to log in.");
      console.error(error);
    }
  };

  return(
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <label htmlFor="username">Username:</label><br />
      <input
        type="text"
        id="username"
        name="username"
        value={form.username}
        onChange={handleChange}
        required
      /><br /><br />

      <label htmlFor="email">Email:</label><br />
      <input
        type="email"
        id="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
      /><br /><br />

      <label htmlFor="password">Password:</label><br />
      <input
        type="password"
        id="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        required
      /><br /><br />

      <button type="submit">Login</button>
      <p>{message}</p>
    </form>
  );
}