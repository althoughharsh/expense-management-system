import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { setToken } from "../auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const notice = location.state?.notice || "";

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setIsLoading(true);
      setMessage("");

      const response = await loginUser(form);
      const token = response.data?.token;

      if (!token) {
        throw new Error("Invalid login response");
      }

      setToken(token);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(error.response?.data || "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page auth-page">
      <section className="auth-card">
        <h2>Login</h2>
        <p>Sign in to access your personal expense dashboard.</p>

        <form onSubmit={handleSubmit} className="stack-form">
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
            {isLoading ? "Please wait..." : "Login"}
          </button>
        </form>

        {notice && <p className="message">{notice}</p>}
        {message && <p className="message error">{message}</p>}

        <p className="helper-text">
          New user? <Link to="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
