import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const inputClass =
  "w-full rounded-xl border border-accent-white/10 bg-accent-white/[0.03] px-4 py-3 text-sm text-accent-white outline-none transition focus:border-accent-white/30 placeholder:text-accent-white/30";

export default function AdminRoute({ children }) {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;

      if (error) setError("Unable to check your session. Please refresh.");
      setSession(data?.session ?? null);
      setChecking(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setChecking(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (checking) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center text-sm text-accent-white/60">
        Checking admin session...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto flex min-h-[65vh] max-w-md items-center px-4 py-12">
        <form
          onSubmit={handleLogin}
          className="w-full rounded-2xl border border-accent-white/10 bg-accent-white/2 p-6 sm:p-8"
        >
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-accent-white/40">
            GenWalls / Admin
          </p>

          <h1 className="text-2xl font-semibold text-accent-white">
            Admin login
          </h1>

          <p className="mb-6 mt-2 text-sm text-accent-white/50">
            Sign in to manage your wallpapers.
          </p>

          <label
            htmlFor="admin-email"
            className="mb-2 block text-sm text-accent-white/80"
          >
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />

          <label
            htmlFor="admin-password"
            className="mb-2 mt-4 block text-sm text-accent-white/80"
          >
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className={inputClass}
          />

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-accent-white px-5 py-3.5 text-sm font-medium text-accent-dark transition disabled:opacity-50 active:opacity-80 lg:hover:opacity-90"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto flex max-w-6xl justify-end px-4 pt-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl border border-accent-white/10 px-3 py-2 text-sm text-accent-white/70 transition active:opacity-70 lg:hover:bg-accent-white/5"
        >
          Sign out
        </button>
      </div>

      {children}
    </div>
  );
}
