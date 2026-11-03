import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function About() {
  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [about, setAbout] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  // Normalize image path
  const buildImageUrl = (image) => {
    if (!image) return "";
    let cleanImage = image.replace(/^\/+/, "");
    if (cleanImage.startsWith("uploads/")) {
      cleanImage = cleanImage.replace("uploads/", "");
    }
    return `${BASE_URL}/uploads/${cleanImage}`;
  };

  const loadAbout = async () => {
    try {
      const res = await fetch(`${API_URL}/about/all`, { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.about.length > 0) {
        const record = data.about[0];
        setAbout(record);
        setImageUrl(buildImageUrl(record.image));
      }
    } catch (err) {
      console.error("Error fetching About:", err);
    }
  };

  useEffect(() => {
    loadAbout();
  }, []);

  return (
    <section id="about" className="w-full bg-gray-50 py-10 md:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
  <span className="text-yellow-500">About</span> <br />
  <span className="text-red-500">Premium</span>{" "}
  <span className="text-black">Look Texture</span>
</h2>

        </div>

        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full lg:w-5/12 h-64 sm:h-80 md:h-96 lg:h-[420px]"
          >
            <img
              src={
                imageUrl
                  ? imageUrl
                  : "https://placehold.co/800x600?text=Loading..."
              }
              alt="About"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/800x600?text=Image+Not+Found";
              }}
              className="w-full h-full object-cover rounded-2xl shadow-xl"
            />
          </motion.div>

          {/* CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full lg:w-7/12 bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border-t-4 border-yellow-500 flex flex-col justify-center h-auto lg:h-[420px]"
          >
            {about ? (
              <>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-gray-900">
                  {about.title}
                </h3>

                <h4 className="text-sm sm:text-base font-semibold text-gray-600 mb-3">
                  {about.subtitle}
                </h4>

                <p className="text-sm sm:text-base leading-relaxed text-gray-700 whitespace-pre-line">
                  {about.description}
                </p>
              </>
            ) : (
              <p className="text-gray-500 text-sm">Loading About...</p>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
