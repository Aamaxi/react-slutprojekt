import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState(null); // For success message
  const [errorMessage, setErrorMessage] = useState(null); // For error message
  const { login } = useAuth(); // Use the login function from AuthContext

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", form);
      const { token, username } = response.data;

      if (username) {
        login(token); // Call the login function to update the global state

        // Set the success message
        setSuccessMessage(
          <div role="alert" className="alert alert-success w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>You are logged in</span>
          </div>
        );

        setErrorMessage(null); // Clear any previous error messages
      } else {
        setErrorMessage(
          <div role="alert" className="alert alert-error w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error! Task failed successfully.</span>
          </div>
        );
      }
    } catch (error) {
      setErrorMessage(
        <div role="alert" className="alert alert-error w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error! Task failed successfully.</span>
        </div>
      );
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-100">
      <div className="w-xs">
        <form
          onSubmit={handleSubmit}
          className="fieldset bg-base-200 border border-base-300 p-4 rounded-box"
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

        {/* Display success or error message */}
        <div className="mt-4">
          {successMessage}
          {errorMessage}
        </div>
      </div>
    </div>
  );
}