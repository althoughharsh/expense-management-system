import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";

export default function HomePage() {
  const loggedIn = isAuthenticated();

  return (
    <main className="page home-page">
      <section className="hero">
        <p className="kicker">Expense Tracker</p>
        <h1>Track smarter, spend better.</h1>
        <p className="subtitle">
          Build your daily money habit with secure login and private expense history.
        </p>
        <div className="cta-row">
          {loggedIn ? (
            <Link className="btn" to="/dashboard">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link className="btn" to="/signup">
                Create Account
              </Link>
              <Link className="btn ghost" to="/login">
                Login
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="feature-grid">
        <article>
          <h3>Private Data</h3>
          <p>Expenses are tied to your account and only shown after login.</p>
        </article>
        <article>
          <h3>Fast Flow</h3>
          <p>React UI sends requests through Axios to your Express API instantly.</p>
        </article>
        <article>
          <h3>Persistent History</h3>
          <p>See your previous expenses every time you log in.</p>
        </article>
      </section>
    </main>
  );
}
