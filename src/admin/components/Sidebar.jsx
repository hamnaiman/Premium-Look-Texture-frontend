import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  PhotoIcon,
  RectangleStackIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  ArrowLeftOnRectangleIcon,
  SparklesIcon,     // Hero Section
  InformationCircleIcon, // ⭐ About Section Icon
  BriefcaseIcon,    // ⭐ Projects Icon
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: HomeIcon, color: "text-blue-500" },
    { name: "Hero Section", path: "/admin/hero", icon: SparklesIcon, color: "text-purple-500" },

    // ⭐ NEW About Section
    { name: "About Section", path: "/admin/about", icon: InformationCircleIcon, color: "text-green-600" },

    // ⭐ NEW Projects Section
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
    <aside className="w-64 bg-white border-r border-gray-200 h-screen p-5 fixed">
      {/* Logo */}
      <h2 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-tight">
        Admin Panel
      </h2>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 p-2 rounded-lg transition
                font-medium text-gray-900
                ${isActive ? "bg-gray-100 shadow-sm" : "hover:bg-gray-100"}
              `}
            >
              <Icon className={`w-5 h-5 ${item.color}`} />
              {item.name}
            </Link>
          );
        })}

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3 p-2 rounded-lg mt-6 bg-red-500 text-white hover:bg-red-600 transition"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </nav>
    </aside>
  );
}
