import { useEffect, useState } from "react";

export default function Hero() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [hero, setHero] = useState(null);

  useEffect(() => {
    const loadHero = async () => {
      const res = await fetch(`${API_URL}/hero/all`);
      const data = await res.json();
      if (data.success && data.hero.length > 0) {
        setHero(data.hero[0]);
      }
    };
    loadHero();
  }, []);

  if (!hero) return null;

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <img
        src={`${API_URL.replace("/api", "")}/uploads/${hero.bgImage}`}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="w-full max-w-3xl">
          <div className="bg-gray-500/70 backdrop-blur-md rounded-xl px-4 sm:px-6 md:px-8 py-6 sm:py-8 text-center shadow-md">

            {/* Title */}
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {hero.title}
            </h1>

            {/* Description */}
            <p className="text-gray-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-5">
              {hero.description}
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-3 flex-wrap">
              {hero.primaryBtnText && (
                <a
                  href={hero.primaryBtnLink}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-md font-medium transition text-sm sm:text-base"
                >
                  {hero.primaryBtnText}
                </a>
              )}

              {hero.secondaryBtnText && (
                <a
                  href={hero.secondaryBtnLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-md font-medium transition text-sm sm:text-base"
                >
                  {hero.secondaryBtnText}
                </a>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
