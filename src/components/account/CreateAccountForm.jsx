import { useState } from "react";
import axios from "axios";

export default function CreateAccountForm() {
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
      console.log("FORM", form)
      const response = await axios.post("http://localhost:5000/register", form);
      setMessage("Account created successfully!");
    } catch (error) {
      setMessage("Failed to create account.");
      console.log([form, setForm])
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Account</h2>

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

      <button type="submit">Create Account</button>
      <p>{message}</p>
    </form>
  );
}
