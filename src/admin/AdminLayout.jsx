import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function AdminLayout({ children, className = "" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className={`min-h-screen min-w-0 ${className}`}>
      <Sidebar mobileOpen={menuOpen} onNavigate={() => setMenuOpen(false)} />
      <div className="min-h-screen w-full min-w-0 bg-gray-100 md:ml-64 md:w-[calc(100%-16rem)]">
        <button
          type="button"
          aria-label={menuOpen ? "Close admin menu" : "Open admin menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="fixed bottom-4 right-4 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-emerald-800 text-white shadow-lg md:hidden"
        >
          {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
        <Header />
        <main className="min-w-0 p-3 sm:p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
