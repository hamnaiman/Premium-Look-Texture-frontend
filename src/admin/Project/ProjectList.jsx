// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import AdminLayout from "../AdminLayout";

// export default function ProjectList() {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const [projects, setProjects] = useState([]);

//   const load = async () => {
//     const res = await fetch(`${API_URL}/projects/all`);
//     const data = await res.json();
//     if (data.success) setProjects(data.projects);
//   };

//   const del = async (id) => {
//     if (!window.confirm("Delete this project?")) return;
//     await fetch(`${API_URL}/projects/delete/${id}`, { method: "DELETE" });
//     load();
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   return (
//     <AdminLayout>
//       <div className="p-6">

//         {/* Header */}
//         <div className="flex justify-between mb-6">
//           <h1 className="text-3xl font-bold">Projects</h1>
//           <Link
//             to="/admin/projects/add"
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             + Add Project
//           </Link>
//         </div>

//         {/* Table */}
//         <div className="bg-white border rounded-xl shadow overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-4 border">Images</th>
//                 <th className="p-4 border">Title</th>
//                 <th className="p-4 border">Description</th>
//                 <th className="p-4 border text-center">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {projects.map((p) => (
//                 <tr key={p._id} className="hover:bg-gray-50">
//                   {/* Images */}
//                   <td className="p-4 border">
//                     <div className="flex gap-2">
//                       {p.images?.map((img, i) => (
//                         <img
//                           key={i}
//                           src={`${API_URL.replace("/api","")}/uploads/${img}`}
//                           className="w-20 h-12 object-cover rounded"
//                         />
//                       ))}
//                     </div>
//                   </td>

//                   {/* Title */}
//                   <td className="p-4 border font-medium">{p.title}</td>

//                   {/* Description */}
//                   <td className="p-4 border text-sm">
//                     {p.description.length > 60
//                       ? p.description.slice(0, 60) + "..."
//                       : p.description}
//                   </td>

//                   {/* Actions */}
//                   <td className="p-4 border">
//                     <div className="flex justify-center gap-2">
//                       <Link
//                         to={`/admin/projects/edit/${p._id}`}
//                         className="bg-yellow-500 text-white px-3 py-1 rounded"
//                       >
//                         Edit
//                       </Link>
//                       <button
//                         onClick={() => del(p._id)}
//                         className="bg-red-600 text-white px-3 py-1 rounded"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}

//               {projects.length === 0 && (
//                 <tr>
//                   <td colSpan="4" className="text-center p-6 text-gray-600">
//                     No projects found.
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

export default function ProjectList() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [projects, setProjects] = useState([]);

  // Helper: build proper image URL (Cloudinary or local)
  const buildImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `${API_URL.replace("/api", "")}/uploads/${img.replace(/^\/+/, "")}`;
  };

  const load = async () => {
    const res = await fetch(`${API_URL}/projects/all`);
    const data = await res.json();
    if (data.success) setProjects(data.projects);
  };

  const del = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await fetch(`${API_URL}/projects/delete/${id}`, { method: "DELETE" });
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">

        {/* Header */}
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Projects</h1>
          <Link
            to="/admin/projects/add"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Project
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white border rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 border">Images</th>
                <th className="p-4 border">Title</th>
                <th className="p-4 border">Description</th>
                <th className="p-4 border text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  {/* Images */}
                  <td className="p-4 border">
                    <div className="flex gap-2">
                      {p.images?.map((img, i) => (
                        <img
                          key={i}
                          src={buildImageUrl(img)}
                          alt={`${p.title}-${i}`}
                          className="w-20 h-12 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/80x50?text=Not+Found";
                          }}
                        />
                      ))}
                    </div>
                  </td>

                  {/* Title */}
                  <td className="p-4 border font-medium">{p.title}</td>

                  {/* Description */}
                  <td className="p-4 border text-sm">
                    {p.description.length > 60
                      ? p.description.slice(0, 60) + "..."
                      : p.description}
                  </td>

                  {/* Actions */}
                  <td className="p-4 border">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/admin/projects/edit/${p._id}`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => del(p._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {projects.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-600">
                    No projects found.
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