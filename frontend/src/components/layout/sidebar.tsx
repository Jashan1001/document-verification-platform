import { LayoutDashboard, FileText, ShieldCheck } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors duration-300">
      <div className="p-6 font-bold text-xl">DocVerify</div>

      <nav className="px-4 space-y-2">
        <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <SidebarItem icon={<FileText size={18} />} label="Documents" />
        <SidebarItem icon={<ShieldCheck size={18} />} label="Verification" />
      </nav>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer transition">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}