import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import servicespagebg from "../assets/services-page-bg.jpg";
import {
  FaBrush,
  FaBuilding,
  FaPalette,
  FaLayerGroup,
  FaSearch
} from "react-icons/fa";

export default function Services() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [services, setServices] = useState([]);

  const uiConfig = [
    { icon: <FaBrush />, color: "from-yellow-300 to-yellow-500" },
    { icon: <FaBuilding />, color: "from-red-400 to-red-600" },
    { icon: <FaPalette />, color: "from-blue-400 to-blue-600" },
    { icon: <FaLayerGroup />, color: "from-purple-400 to-purple-600" },
    { icon: <FaSearch />, color: "from-pink-400 to-pink-600" }
  ];

  useEffect(() => {
    fetch(`${API_URL}/services/all`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setServices(data.services);
      });
  }, []);

  return (
    <section
      id="services"
      className="w-full py-10 relative overflow-hidden"
      style={{
        backgroundImage: `url(${servicespagebg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-10 md:gap-16 bg-white/60 backdrop-blur-md rounded-2xl py-8 sm:py-10 md:py-10">

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-800 ">
          What We <span className="text-yellow-500">Offer</span> <br />
          <span className="text-red-500">Bright</span> &{" "}
          <span className="text-blue-500">Premium</span> Solutions
        </h2>

        {/* Cards */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-6 sm:gap-8 md:gap-10 justify-center w-full">
          {services.map((service, index) => {
            const ui = uiConfig[index % uiConfig.length];

            return (
              <motion.div
                key={service._id}
                whileHover={{
                  scale: 1.05,
                  rotate: 1,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative w-full sm:w-[45%] lg:w-[30%] bg-white rounded-2xl p-6 sm:p-8 md:p-10 border-t-4 hover:border-t-8 transition-all duration-500 shadow-lg overflow-hidden"
              >
                {/* Gradient Accent */}
                <div
                  className={`absolute -top-10 -left-10 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-tr ${ui.color} opacity-25 rounded-full rotate-45`}
                ></div>

                {/* Icon */}
                <div className="text-2xl sm:text-3xl md:text-3xl mb-3 sm:mb-4 text-gray-800">
                  {ui.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl md:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-700 text-sm sm:text-base md:text-base leading-relaxed">
                  {service.description}
                </p>

                {/* Decorative Circles */}
                <div className="absolute -right-6 sm:-right-10 -bottom-6 sm:-bottom-10 w-12 sm:w-20 h-12 sm:h-20 bg-yellow-200 opacity-25 rounded-full"></div>
                <div className="absolute -left-4 sm:-left-8 top-16 sm:top-20 w-8 sm:w-16 h-8 sm:h-16 bg-red-200 opacity-25 rounded-full"></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
