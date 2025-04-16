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
      const response = await axios.post("http://localhost:5000/register", form);
      setMessage("Account created successfully!");
    } catch (error) {
      setMessage("Failed to create account.");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-100">
      <form
        onSubmit={handleSubmit}
        className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box"
      >
        <legend className="fieldset-legend text-lg font-bold mb-4">
          Create Account
        </legend>

        <label className="fieldset-label block mb-2">Username</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          className="input input-bordered w-full mb-4"
          placeholder="Username"
          required
        />

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

        <button type="submit" className="btn btn-neutral w-full mt-4">
          Create Account
        </button>

        <p className="mt-4 text-center text-sm text-error">{message}</p>
      </form>
    </div>
  );
}