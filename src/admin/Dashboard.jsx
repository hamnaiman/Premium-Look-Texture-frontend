import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";

import {
  CubeIcon,
  WrenchScrewdriverIcon,
  PhotoIcon,
  StarIcon,
  UserGroupIcon,
  RectangleStackIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";


export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetch(`${API_URL}/admin/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
          return;
        }
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      });
  }, [API_URL, navigate]);

  if (loading)
    return (
      <div className="p-6 text-lg font-medium text-gray-900">
        Checking authentication...
      </div>
    );

  // Dashboard Cards Data
  const cards = [
    {
      title: "Hero Section",
      description: "Edit hero heading, subheading and buttons.",
      path: "/admin/hero",
      icon: SparklesIcon,
         color: "border-t-purple-500",
      hover: "hover:bg-purple-50",
      
    },
    {
      title: "Collections",
      description: "Create, edit and manage all your collection.",
      path: "/admin/collection",
      icon: CubeIcon,
      color: "border-t-red-500",
      hover: "hover:bg-red-50",
    },
    {
      title: "Services",
      description: "Control all services provided to customers.",
      path: "/admin/services",
      icon: WrenchScrewdriverIcon,
      color: "border-t-blue-500",
      hover: "hover:bg-blue-50",
    },
    {
      title: "Gallery",
      description: "Upload & organize color scheme gallery.",
      path: "/admin/gallery",
      icon: PhotoIcon,
      color: "border-t-yellow-500",
      hover: "hover:bg-yellow-50",
    },
    {
      title: "Testimonials",
      description: "Manage customer reviews and feedback.",
      path: "/admin/testimonials",
      icon: StarIcon,
      color: "border-t-green-500",
      hover: "hover:bg-green-50",
    },



    // ⭐ NEW CARD — About Section
    {
      title: "About Section",
      description: "Edit the about page content easily.",
      path: "/admin/about",
      icon: UserGroupIcon,
   color: "border-t-orange-500",
      hover: "hover:bg-orange-50",
    },

    // ⭐ NEW CARD — Projects
    {
      title: "Projects",
      description: "Manage past and ongoing project details.",
      path: "/admin/projects",
      icon: RectangleStackIcon,
      color: "border-t-orange-500",
      hover: "hover:bg-orange-50",
    }
  ];


  return (
    <AdminLayout>
      <div className="p-6">

        {/* HERO SECTION */}
        <div className="p-6 bg-gradient-to-r from-gray-100 to-white rounded-xl mb-8 shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold text-black">
            Admin Dashboard
          </h1>
          <p className="text-gray-800 mt-2 max-w-2xl">
            Manage the website content including products, services and gallery from here.
          </p>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className={`p-6 bg-white rounded-xl border shadow-sm ${card.color}
                          cursor-pointer transition-all duration-200 transform 
                          hover:-translate-y-1 hover:shadow-md ${card.hover}`}
            >
              {/* Icon */}
              <card.icon className="h-10 w-10 text-gray-900" />

              {/* Title */}
              <h3 className="font-semibold text-xl text-black mt-4">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-gray-900 text-sm mt-2 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </AdminLayout>
  );
}
