import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

export default function Testimonials() {
  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [testimonials, setTestimonials] = useState([]);

  const loadTestimonials = async () => {
    try {
      const res = await fetch(`${API_URL}/testimonials/all`);
      const data = await res.json();

      if (data.success) {
        const themed = data.testimonials.map((t, i) => {
          const theme = [
            { color: "text-yellow-500", gradient: "from-yellow-400 to-yellow-500", circleColor: "bg-yellow-200" },
            { color: "text-blue-600", gradient: "from-blue-400 to-blue-600", circleColor: "bg-blue-200" },
            { color: "text-red-500", gradient: "from-red-400 to-red-500", circleColor: "bg-red-200" },
          ];
          return { ...t, ...theme[i % 3] };
        });

        setTestimonials(themed);
      }
    } catch (error) {
      console.log("Error loading testimonials:", error);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  return (
    <section
      id="testimonials"
      className="w-full bg-gray-50 py-10 sm:py-14 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-12 sm:gap-16">

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-800 leading-tight">
          <span className="text-yellow-500">Bright</span> Reviews <br />
          <span className="text-blue-500">From</span> Our <span className="text-red-500">Clients</span>
        </h2>

        {/* Testimonials Cards */}
        <div className="flex flex-col md:flex-row flex-wrap gap-8 justify-center w-full">
          {testimonials.map((t, index) => (
            <motion.div
              key={t._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative w-full sm:w-[90%] md:w-[45%] lg:w-[30%] bg-white rounded-2xl p-6 sm:p-8 border-t-4 border-transparent shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-t-8"
            >
              {/* Gradient Top Border */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${t.gradient}`}></div>

              {/* Quote */}
              <p className="text-base sm:text-lg italic mb-4 sm:mb-6 text-gray-700">
                “{t.message}”
              </p>

              {/* Author */}
              <p className={`font-bold ${t.color} text-right text-sm sm:text-md`}>
                — {t.name}
              </p>

              {/* Image */}
              {t.image && (
                <img
                  src={`${BASE_URL}${t.image}`}
                  alt={t.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover absolute -top-6 -right-6 border-2 border-white shadow-lg"
                />
              )}

              {/* Decorative Circles */}
              <div className={`absolute -right-10 -bottom-10 w-20 h-20 ${t.circleColor} opacity-30 rounded-full animate-pulse`}></div>
              <div className={`absolute -left-8 top-16 w-16 h-16 ${t.circleColor} opacity-25 rounded-full animate-ping`}></div>
              <div className={`absolute right-6 top-6 w-12 h-12 ${t.circleColor} opacity-20 rounded-full`}></div>

              {/* Glow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white via-transparent to-white opacity-10 pointer-events-none rounded-2xl"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
