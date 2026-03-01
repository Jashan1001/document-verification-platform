import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors duration-300 hidden md:block">
      
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-neutral-800">
        <span className="text-xl font-bold tracking-tight">
          DocVerify
        </span>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        <SidebarItem
          to="/"
          label="Dashboard"
          icon={<LayoutDashboard size={18} />}
        />
        <SidebarItem
          to="/documents"
          label="Documents"
          icon={<FileText size={18} />}
        />
        <SidebarItem
          to="/verification"
          label="Verification"
          icon={<ShieldCheck size={18} />}
        />
      </nav>
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
        flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
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