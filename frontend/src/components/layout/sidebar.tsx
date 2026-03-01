import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "../../store/auth-store";

export default function Sidebar() {
  const user = useAuthStore((s) => s.user);

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors duration-300">

      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-neutral-800">
        <span className="text-xl font-bold tracking-tight">
          DocVerify
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">

        {/* Dashboard */}
        <SidebarItem
          to="/"
          label="Dashboard"
          icon={<LayoutDashboard size={18} />}
        />

        {/* Documents (for all authenticated users) */}
        <SidebarItem
          to="/documents"
          label="Documents"
          icon={<FileText size={18} />}
        />

        {/* SUPER_ADMIN only */}
        {user?.role === "SUPER_ADMIN" && (
          <SidebarItem
            to="/admin"
            label="Admin Panel"
            icon={<ShieldCheck size={18} />}
          />
        )}

      </nav>

      {/* Footer (optional future use) */}
      <div className="p-4 border-t border-gray-200 dark:border-neutral-800 text-xs opacity-50">
        Role: {user?.role || "Unknown"}
      </div>

    </aside>
  );
}

function SidebarItem({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `
        flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200
        ${
          isActive
            ? "bg-gray-200 dark:bg-neutral-800 font-medium"
            : "hover:bg-gray-100 dark:hover:bg-neutral-800"
        }
        `
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}