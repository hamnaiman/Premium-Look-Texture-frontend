// import { useEffect, useState } from "react";

// export default function Gallery() {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const [colors, setColors] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchColors = async () => {
//     try {
//       const res = await fetch(`${API_URL}/gallery`);
//       const data = await res.json();

//       if (data.success && Array.isArray(data.colors)) {
//         setColors(data.colors);
//       } else {
//         setColors([]);
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchColors();
//   }, []);

//   return (
//     <section className="py-10 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//         {/* Heading */}
//         <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-8 sm:mb-12 leading-tight">
//           <span className="text-black">Explore Our</span>{" "}
//           <span className="text-yellow-500">Premium</span> <br />
//           <span className="text-red-500">Color</span>{" "}
        
//           <span className="text-blue-500">Shades</span>
//         </h2>

//         {loading ? (
//           <p className="text-center text-gray-600">Loading color gallery...</p>
//         ) : colors.length === 0 ? (
//           <p className="text-center text-gray-600">No colors found.</p>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">

//             {colors.map((c) => (
//               <div
//                 key={c._id}
//                 className="group cursor-pointer transition-transform transform hover:-translate-y-2"
//               >
//                 <div
//                   className="w-full h-24 sm:h-28 md:h-32 rounded-xl shadow-md border relative overflow-hidden"
//                   style={{ backgroundColor: c.hex }}
//                 >
//                   <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-25 transition"></div>
//                 </div>

//                 <p className="mt-2 text-sm sm:text-base font-semibold text-gray-800 text-center">
//                   {c.name}
//                 </p>

//                 <p className="text-xs sm:text-sm text-gray-500 text-center">{c.hex}</p>
//               </div>
//             ))}

//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

import { useEffect, useState } from "react";

export default function Gallery() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH COLORS ================= */
  const fetchColors = async () => {
    try {
      const res = await fetch(`${API_URL}/gallery`);
      const data = await res.json();

      if (data.success && Array.isArray(data.colors)) {
        setColors(data.colors);
      } else {
        setColors([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchColors();
  }, []);

  /* ================= OPEN PREVIEW IN NEW TAB ================= */
  const handleColorClick = (hex) => {
    if (!hex) return;

    // remove # for URL safety
    const safeHex = hex.replace("#", "");
    const url = `/room-preview?color=${safeHex}`;

    // open in new browser tab
    window.open(url, "_blank");
  };

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADING ================= */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-8 sm:mb-12 leading-tight">
          <span className="text-black">Explore Our</span>{" "}
          <span className="text-yellow-500">Premium</span> <br />
          <span className="text-red-500">Color</span>{" "}
          <span className="text-blue-500">Shades</span>
        </h2>

        {/* ================= STATES ================= */}
        {loading ? (
          <p className="text-center text-gray-600">
            Loading color gallery...
          </p>
        ) : colors.length === 0 ? (
          <p className="text-center text-gray-600">
            No colors found.
          </p>
        ) : (
          /* ================= COLOR GRID ================= */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
            {colors.map((c) => (
              <div
                key={c._id}
                onClick={() => handleColorClick(c.hex)}
                className="group cursor-pointer relative transition-transform transform hover:-translate-y-2"
              >
                <div
                  className="w-full h-24 sm:h-28 md:h-32 rounded-xl shadow-md border relative overflow-hidden"
                  style={{ backgroundColor: c.hex }}
                >
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-25 transition"></div>
                </div>

                <p className="mt-2 text-sm sm:text-base font-semibold text-gray-800 text-center">
                  {c.name}
                </p>

                <p className="text-xs sm:text-sm text-gray-500 text-center">
                  {c.hex}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
