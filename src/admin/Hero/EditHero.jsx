// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import AdminLayout from "../AdminLayout";

// export default function EditHero() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_API_URL;

//   const [form, setForm] = useState({
//     title: "",
//     subtitle: "",
//     description: "",
//     primaryBtnText: "",
//     primaryBtnLink: "",
//     secondaryBtnText: "",
//     secondaryBtnLink: "",
//     bgImage: "",
//   });

//   const [newImage, setNewImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const loadHero = async () => {
//       try {
//         const res = await fetch(`${API_URL}/hero/all`);
//         const data = await res.json();

//         if (data.success) {
//           const heroItem = data.hero.find(h => h._id === id);
//           if (heroItem) setForm(heroItem);
//         }
//       } catch (err) {
//         console.error("Error loading hero:", err);
//       }
//     };

//     loadHero();
//   }, [id]);

//   const handleChange = e =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleUpdate = async e => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const fd = new FormData();

//       Object.keys(form).forEach(key => {
//         if (key !== "bgImage") {
//           fd.append(key, form[key]);
//         }
//       });

//       if (newImage) {
//         fd.append("bgImage", newImage);
//       }

//       const res = await fetch(`${API_URL}/hero/update/${id}`, {
//         method: "PUT",
//         body: fd,
//       });

//       const data = await res.json();

//       if (!res.ok || !data.success) {
//         throw new Error(data.message || "Server error");
//       }

//       alert("Hero updated successfully");
//       navigate("/admin/hero");
//     } catch (err) {
//       console.error("Update error:", err);
//       alert("Update failed. Check console for details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AdminLayout>
//       <div className="p-6 bg-white rounded shadow max-w-3xl mx-auto">
//         <h1 className="text-2xl font-bold mb-6">Edit Hero</h1>

//         <form onSubmit={handleUpdate} className="space-y-4">
//           <input
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             placeholder="Title"
//             className="border p-3 w-full rounded"
//             required
//           />

//           <input
//             name="subtitle"
//             value={form.subtitle}
//             onChange={handleChange}
//             placeholder="Subtitle"
//             className="border p-3 w-full rounded"
//           />

//           <textarea
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             rows="4"
//             placeholder="Description"
//             className="border p-3 w-full rounded"
//           />

//           {form.bgImage && (
//             <img
//               src={form.bgImage}
//               className="w-full h-40 object-cover rounded"
//               alt="Hero"
//             />
//           )}

//           <input
//             type="file"
//             accept="image/*"
//             onChange={e => setNewImage(e.target.files[0])}
//           />

//           <button
//             disabled={loading}
//             className="w-full bg-green-600 text-white py-3 rounded"
//           >
//             {loading ? "Updating..." : "Update Hero"}
//           </button>
//         </form>
//       </div>
//     </AdminLayout>
//   );
// }


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../AdminLayout";

export default function EditHero() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    primaryBtnText: "",
    primaryBtnLink: "",
    secondaryBtnText: "",
    secondaryBtnLink: "",
    bgImage: "",
  });

  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load hero data
  useEffect(() => {
    const loadHero = async () => {
      try {
        const res = await fetch(`${API_URL}/hero/all`);
        const data = await res.json();

        if (data.success) {
          const heroItem = data.hero.find(h => h._id === id);
          if (heroItem) setForm(heroItem);
        }
      } catch (err) {
        console.error("Error loading hero:", err);
      }
    };

    loadHero();
  }, [id, API_URL]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Update hero
  const handleUpdate = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();

      Object.keys(form).forEach(key => {
        if (key !== "bgImage") {
          fd.append(key, form[key]);
        }
      });

      if (newImage) {
        fd.append("bgImage", newImage);
      }

      const res = await fetch(`${API_URL}/hero/update/${id}`, {
        method: "PUT",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Server error");
      }

      alert("Hero updated successfully");
      navigate("/admin/hero");
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Delete hero
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this hero?")) return;

    try {
      const res = await fetch(`${API_URL}/hero/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Delete failed");
      }

      alert("Hero deleted successfully");
      navigate("/admin/hero");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed. Check console for details.");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-white rounded shadow max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Hero</h1>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="border p-3 w-full rounded"
            required
          />

          <input
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            placeholder="Subtitle"
            className="border p-3 w-full rounded"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            placeholder="Description"
            className="border p-3 w-full rounded"
          />

          {/* Show existing image */}
          {form.bgImage && (
            <img
              src={`${API_URL}/${form.bgImage}`}
              className="w-full h-40 object-cover rounded"
              alt="Hero"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={e => setNewImage(e.target.files[0])}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded"
          >
            {loading ? "Updating..." : "Update Hero"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="w-full bg-red-600 text-white py-3 rounded"
          >
            Delete Hero
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}