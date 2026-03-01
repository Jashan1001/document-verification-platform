import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 text-black dark:text-white transition-colors duration-300">
      
      <div className="flex">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">

          {/* Top Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}