import Sidebar from "./sidebar";
import Navbar from "./navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 text-black dark:text-white transition-colors duration-300">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen flex flex-col">
          <Navbar />
          <main className="p-6 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}