import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth-store";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-neutral-800">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm opacity-60 mt-2">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email Input */}
          <div>
            <label className="block text-sm mb-1 opacity-70">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-transparent outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm mb-1 opacity-70">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-transparent outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold bg-black dark:bg-white text-white dark:text-black transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

      </div>
    </div>
  );
}