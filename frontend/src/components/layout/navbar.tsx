import ThemeToggle from "../ui/theme-toggle";

export default function Navbar() {
  return (
    <div className="h-16 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between px-6 transition-colors duration-300">
      <h1 className="font-semibold text-lg">Dashboard</h1>
      <ThemeToggle />
    </div>
  );
}