// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiX } from "react-icons/fi";

// export default function Projects() {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const [projects, setProjects] = useState([]);
//   const [activeImage, setActiveImage] = useState(null);

//   useEffect(() => {
//     fetch(`${API_URL}/projects/all`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) setProjects(data.projects);
//       });
//   }, []);

//   return (
//     <section
//       id="projects"
//       className="py-10 sm:py-14 bg-gradient-to-b from-gray-50 to-white"
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//         {/* Heading */}
//         <div className="text-center mb-8 sm:mb-10">
//           <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 leading-tight">
//             Crafting <span className="text-yellow-500">Premium</span>{" "}
//             <span className="text-black">Texture</span> <br />
//             <span className="text-red-500">Paint</span>{" "}
//             <span className="text-blue-500">Experiences</span>
//           </h2>
//         </div>

//         {/* Projects Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
//           {projects.map((p, index) => (
//             <motion.div
//               key={p._id}
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.7, delay: index * 0.1 }}
//               viewport={{ once: true }}
//               className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition overflow-hidden"
//             >
//               {/* Images */}
//               <div className="relative p-3 sm:p-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">

//                   {/* Main Image */}
//                   {p.images?.[0] && (
//                     <img
//                       src={`${API_URL.replace("/api", "")}/uploads/${p.images[0]}`}
//                       alt={p.title}
//                       onClick={() =>
//                         setActiveImage(
//                           `${API_URL.replace("/api", "")}/uploads/${p.images[0]}`
//                         )
//                       }
//                       className="md:col-span-2 h-52 sm:h-60 md:h-64 w-full object-cover rounded-2xl cursor-pointer transform group-hover:scale-[1.02] transition duration-500"
//                     />
//                   )}

//                   {/* Side Images */}
//                   <div className="flex flex-col gap-2 sm:gap-3">
//                     {p.images?.slice(1, 3).map((img, i) => (
//                       <img
//                         key={i}
//                         src={`${API_URL.replace("/api", "")}/uploads/${img}`}
//                         alt={`${p.title}-${i}`}
//                         onClick={() =>
//                           setActiveImage(
//                             `${API_URL.replace("/api", "")}/uploads/${img}`
//                           )
//                         }
//                         className="h-24 sm:h-28 md:h-32 w-full object-cover rounded-2xl cursor-pointer transform hover:scale-105 transition duration-500"
//                       />
//                     ))}
//                   </div>
//                 </div>

//                 {/* Hover Overlay */}
//                 <div className="pointer-events-none absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition rounded-3xl"></div>
//               </div>

//               {/* Content */}
//               <div className="px-4 sm:px-6 pb-6 sm:pb-8">
//                 <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
//                   {p.title}
//                 </h3>
//                 <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
//                   {p.description.length > 130
//                     ? p.description.slice(0, 130) + "..."
//                     : p.description}
//                 </p>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Empty State */}
//         {projects.length === 0 && (
//           <p className="text-center text-gray-500 mt-10 sm:mt-16">
//             No projects available at the moment.
//           </p>
//         )}
//       </div>

//       {/* IMAGE MODAL / LIGHTBOX */}
//       <AnimatePresence>
//         {activeImage && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4 sm:px-6"
//             onClick={() => setActiveImage(null)}
//           >
//             {/* Close Button */}
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setActiveImage(null);
//               }}
//               className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-white/90 hover:bg-white text-black p-2 sm:p-3 rounded-full shadow-lg transition"
//             >
//               <FiX size={22} />
//             </button>

//             {/* Modal Image */}
//             <motion.img
//               src={activeImage}
//               initial={{ scale: 0.85 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.85 }}
//               transition={{ duration: 0.3 }}
//               className="max-w-full sm:max-w-4xl md:max-w-5xl w-full max-h-[80vh] sm:max-h-[85vh] object-contain rounded-2xl shadow-2xl"
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </section>
//   );
// }


import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

export default function Projects() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [projects, setProjects] = useState([]);
  const [activeImage, setActiveImage] = useState(null);

  const buildImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    return `${API_URL.replace("/api", "")}/uploads/${image.replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    fetch(`${API_URL}/projects/all`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProjects(data.projects);
      });
  }, []);

  return (
    <section
      id="projects"
      className="py-10 sm:py-14 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 leading-tight">
            Crafting <span className="text-yellow-500">Premium</span>{" "}
            <span className="text-black">Texture</span> <br />
            <span className="text-red-500">Paint</span>{" "}
            <span className="text-blue-500">Experiences</span>
          </h2>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
          {projects.map((p, index) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition overflow-hidden"
            >
              {/* Images */}
              <div className="relative p-3 sm:p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">

                  {/* Main Image */}
                  {p.images?.[0] && (
                    <img
                      src={buildImageUrl(p.images[0])}
                      alt={p.title}
                      onClick={() => setActiveImage(buildImageUrl(p.images[0]))}
                      className="md:col-span-2 h-52 sm:h-60 md:h-64 w-full object-cover rounded-2xl cursor-pointer transform group-hover:scale-[1.02] transition duration-500"
                    />
                  )}

                  {/* Side Images */}
                  <div className="flex flex-col gap-2 sm:gap-3">
                    {p.images?.slice(1, 3).map((img, i) => (
                      <img
                        key={i}
                        src={buildImageUrl(img)}
                        alt={`${p.title}-${i}`}
                        onClick={() => setActiveImage(buildImageUrl(img))}
                        className="h-24 sm:h-28 md:h-32 w-full object-cover rounded-2xl cursor-pointer transform hover:scale-105 transition duration-500"
                      />
                    ))}
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition rounded-3xl"></div>
              </div>

              {/* Content */}
              <div className="px-4 sm:px-6 pb-6 sm:pb-8">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  {p.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {p.description.length > 130
                    ? p.description.slice(0, 130) + "..."
                    : p.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <p className="text-center text-gray-500 mt-10 sm:mt-16">
            No projects available at the moment.
          </p>
        )}
      </div>

      {/* IMAGE MODAL / LIGHTBOX */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4 sm:px-6"
            onClick={() => setActiveImage(null)}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveImage(null);
              }}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-white/90 hover:bg-white text-black p-2 sm:p-3 rounded-full shadow-lg transition"
            >
              <FiX size={22} />
            </button>

            {/* Modal Image */}
            <motion.img
              src={activeImage}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              transition={{ duration: 0.3 }}
              className="max-w-full sm:max-w-4xl md:max-w-5xl w-full max-h-[80vh] sm:max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}