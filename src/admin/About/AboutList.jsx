// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import AdminLayout from "../AdminLayout";

// export default function AboutList() {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const [aboutData, setAboutData] = useState([]);

//   const load = async () => {
//     const res = await fetch(`${API_URL}/about/all`);
//     const data = await res.json();
//     if (data.success) setAboutData(data.about);
//   };

//   const deleteAbout = async (id) => {
//     if (!window.confirm("Delete this About section?")) return;

//     const res = await fetch(`${API_URL}/about/delete/${id}`, {
//       method: "DELETE",
//     });

//     const data = await res.json();
//     if (data.success) load();
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   return (
//     <AdminLayout>
//       <div className="p-6">

//         {/* Top Heading */}
//         <div className="p-6 bg-gradient-to-r from-gray-100 to-white rounded-xl mb-8 shadow-sm border border-gray-200">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-black">About Section</h1>
//               <p className="text-gray-800 mt-2">Manage About page content.</p>
//             </div>

//             <Link
//               to="/admin/about/add"
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
//             >
//               + Add About
//             </Link>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto bg-white border rounded-xl shadow">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <th className="p-3 border">Image</th>
//                 <th className="p-3 border">Title</th>
//                 <th className="p-3 border">Subtitle</th>
//                 <th className="p-3 border">Description</th>
//                 <th className="p-3 border">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {aboutData.map((a) => (
//                 <tr key={a._id} className="hover:bg-gray-50 transition">

//                   <td className="p-3 border">
//                     {a.image ? (
//                      <img
//   src={`${API_URL.replace("/api", "")}/uploads/${a.image}`}
//   alt="About"
//   className="w-20 h-20 object-cover rounded"
// />

//                     ) : (
//                       "—"
//                     )}
//                   </td>

//                   <td className="p-3 border font-medium">{a.title}</td>

//                   <td className="p-3 border">{a.subtitle || "—"}</td>

//                   <td className="p-3 border">
//                     {a.description.length > 80
//                       ? a.description.substring(0, 80) + "..."
//                       : a.description}
//                   </td>

//                   <td className="p-3 border">
//                     <div className="flex gap-2">

//                       <Link
//                         to={`/admin/about/edit/${a._id}`}
//                         className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
//                       >
//                         Edit
//                       </Link>

//                       <button
//                         onClick={() => deleteAbout(a._id)}
//                         className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
//                       >
//                         Delete
//                       </button>

//                     </div>
//                   </td>

//                 </tr>
//               ))}

//               {aboutData.length === 0 && (
//                 <tr>
//                   <td colSpan="5" className="text-center p-5 text-gray-600">
//                     No About content found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//       </div>
//     </AdminLayout>
//   );
// }


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../AdminLayout";

export default function AboutList() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [aboutData, setAboutData] = useState([]);

  const buildImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    return `${API_URL.replace("/api", "")}/uploads/${image.replace(/^\/+/, "")}`;
  };

  const load = async () => {
    const res = await fetch(`${API_URL}/about/all`);
    const data = await res.json();
    if (data.success) setAboutData(data.about);
  };

  const deleteAbout = async (id) => {
    if (!window.confirm("Delete this About section?")) return;

    const res = await fetch(`${API_URL}/about/delete/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (data.success) load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">

        {/* Top Heading */}
        <div className="p-6 bg-gradient-to-r from-gray-100 to-white rounded-xl mb-8 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black">About Section</h1>
              <p className="text-gray-800 mt-2">Manage About page content.</p>
            </div>

            <Link
              to="/admin/about/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
            >
              + Add About
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white border rounded-xl shadow">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Image</th>
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Subtitle</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {aboutData.map((a) => (
                <tr key={a._id} className="hover:bg-gray-50 transition">

                  <td className="p-3 border">
                    {a.image ? (
                      <img
                        src={buildImageUrl(a.image)}
                        alt="About"
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/80x80?text=Not+Found";
                        }}
                      />
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="p-3 border font-medium">{a.title}</td>

                  <td className="p-3 border">{a.subtitle || "—"}</td>

                  <td className="p-3 border">
                    {a.description.length > 80
                      ? a.description.substring(0, 80) + "..."
                      : a.description}
                  </td>

                  <td className="p-3 border">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/about/edit/${a._id}`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteAbout(a._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {aboutData.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-5 text-gray-600">
                    No About content found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  );
}