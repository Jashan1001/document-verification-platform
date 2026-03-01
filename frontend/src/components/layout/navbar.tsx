import ThemeToggle from "../ui/theme-toggle";
import { useAuthStore } from "../../store/auth-store";

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <div className="h-16 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between px-6 transition-colors duration-300">
      
      <h1 className="font-semibold text-lg">Dashboard</h1>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm opacity-70">
            {user.email}
          </span>
        )}
        <ThemeToggle />
        <button
          onClick={logout}
          className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}