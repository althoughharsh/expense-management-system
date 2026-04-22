import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setMessage("");
      await registerUser(form);
      navigate("/login", {
        replace: true,
        state: { notice: "Registration successful. Please login." }
      });
    } catch (error) {
      setMessage(error.response?.data || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page auth-page">
      <section className="auth-card">
        <h2>Create Account</h2>
        <p>Register once and keep your expense history forever.</p>

        <form onSubmit={handleSubmit} className="stack-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={updateField}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={updateField}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={updateField}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Please wait..." : "Sign Up"}
          </button>
        </form>

        {message && <p className="message error">{message}</p>}

        <p className="helper-text">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}
