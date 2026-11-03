import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon, PhotoIcon, RectangleStackIcon, WrenchScrewdriverIcon,
  UserGroupIcon, ArrowLeftOnRectangleIcon, SparklesIcon,
  InformationCircleIcon, BriefcaseIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar({ mobileOpen = false, onNavigate = () => {} }) {
  const location = useLocation();
  const menu = [
    { name: "Quotation / کوٹیشن", path: "/admin/quotation", icon: BriefcaseIcon, color: "text-emerald-600" },
    { name: "Labour / Site Khata", path: "/admin/ledger", icon: UserGroupIcon, color: "text-emerald-600" },
    { name: "Dashboard", path: "/admin/dashboard", icon: HomeIcon, color: "text-blue-500" },
    { name: "Hero Section", path: "/admin/hero", icon: SparklesIcon, color: "text-purple-500" },
    { name: "About Section", path: "/admin/about", icon: InformationCircleIcon, color: "text-green-600" },
    { name: "Projects", path: "/admin/projects", icon: BriefcaseIcon, color: "text-indigo-600" },
    { name: "Collections", path: "/admin/collection", icon: RectangleStackIcon, color: "text-red-500" },
    { name: "Services", path: "/admin/services", icon: WrenchScrewdriverIcon, color: "text-yellow-500" },
    { name: "Gallery", path: "/admin/gallery", icon: PhotoIcon, color: "text-blue-500" },
    { name: "Testimonials", path: "/admin/testimonials", icon: UserGroupIcon, color: "text-red-500" },
  ];
  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };
  return (
    <>
      {mobileOpen && <button type="button" aria-label="Close admin menu" onClick={onNavigate} className="fixed inset-0 z-40 bg-slate-950/40 md:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 h-dvh w-72 max-w-[85vw] overflow-y-auto border-r border-gray-200 bg-white p-5 shadow-xl transition-transform duration-200 md:w-64 md:translate-x-0 md:shadow-none ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <h2 className="mb-8 text-2xl font-extrabold tracking-tight text-gray-900">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={onNavigate} className={`flex items-center gap-3 rounded-lg p-2 font-medium text-gray-900 transition ${isActive ? "bg-gray-100 shadow-sm" : "hover:bg-gray-100"}`}>
                <Icon className={`h-5 w-5 shrink-0 ${item.color}`} />
                {item.name}
              </Link>
            );
          })}
          <button onClick={logout} className="mt-6 flex items-center gap-3 rounded-lg bg-red-500 p-2 text-white transition hover:bg-red-600">
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
