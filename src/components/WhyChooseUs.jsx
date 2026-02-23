import React from "react";
import { motion } from "framer-motion";
import { FaPaintBrush, FaLeaf, FaUsers, FaDollarSign } from "react-icons/fa";

const reasons = [
  {
    title: "Premium Quality",
    description: "We use high-quality paints that ensure durability, smooth finish, and vibrant colors.",
    color: "bg-yellow-500",
    icon: <FaPaintBrush className="w-6 sm:w-8 h-6 sm:h-8 text-white" />,
  },
  {
    title: "Eco-Friendly",
    description: "Our paints are low-VOC and safe for your family and the environment.",
    color: "bg-blue-500",
    icon: <FaLeaf className="w-6 sm:w-8 h-6 sm:h-8 text-white" />,
  },
  {
    title: "Expert Team",
    description: "Trained professionals ensure perfect application and customer satisfaction.",
    color: "bg-red-500",
    icon: <FaUsers className="w-6 sm:w-8 h-6 sm:h-8 text-white" />,
  },
  {
    title: "Affordable Pricing",
    description: "Top-quality products and services at competitive prices.",
    color: "bg-purple-500",
    icon: <FaDollarSign className="w-6 sm:w-8 h-6 sm:h-8 text-white" />,
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why" className="w-full bg-gray-50 py-10 sm:py-20 relative overflow-hidden">

      {/* Soft Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/30 via-white to-blue-100/20 blur-3xl opacity-60 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

        {/* Heading */}
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-10 sm:mb-14">
  <span className="text-red-500">Why</span> Our{" "}
  <span className="text-yellow-500">Clients</span> <br />
  Prefer <span className="text-blue-500">Us</span>
</h2>


        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
          {reasons.map((item, index) => (
          <motion.div
  key={index}
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: index * 0.15 }}
  whileHover={{ y: -6 }}
  className="group relative bg-white rounded-2xl p-7 sm:p-8 
             border border-gray-200 shadow-md hover:shadow-2xl 
             transition-all duration-500 flex flex-col items-center text-center"
>
  {/* Icon Wrapper */}
  <div
    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center 
                ${item.color} shadow-lg ring-4 ring-white 
                group-hover:scale-110 transition-transform duration-500`}
  >
    {item.icon}
  </div>

  {/* Title */}
  <h3 className="mt-5 text-lg sm:text-xl font-bold text-gray-900 tracking-wide">
    {item.title}
  </h3>

  {/* Divider */}
  <span className="mt-2 mb-3 w-12 h-[2px] bg-gray-200 group-hover:bg-gray-300 transition"></span>

  {/* Description */}
  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
    {item.description}
  </p>

  {/* Soft Hover Overlay */}
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br 
                  from-white/40 to-transparent opacity-0 
                  group-hover:opacity-100 transition duration-500 pointer-events-none" />
</motion.div>

          ))}
        </div>
      </div>
    </section>
  );
}
