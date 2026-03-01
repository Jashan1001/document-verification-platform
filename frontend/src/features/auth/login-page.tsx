import { useState } from "react";
import { useAuthStore } from "../../store/auth-store";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigate("/");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 transition-colors duration-300">
      <div className="bg-white dark:bg-neutral-900 shadow-xl rounded-xl p-8 w-full max-w-md border border-gray-200 dark:border-neutral-800">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Welcome Back
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-transparent outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-transparent outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-black dark:bg-white text-white dark:text-black p-3 rounded-lg font-semibold transition hover:opacity-90"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}