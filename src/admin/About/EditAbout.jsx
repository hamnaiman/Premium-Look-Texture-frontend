import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../AdminLayout";

export default function EditAbout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "", // old image
  });

  const [newImage, setNewImage] = useState(null);

  // Helper to build proper image URL
  const buildImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `${API_URL.replace("/api", "")}/uploads/${img.replace(/^\/+/, "")}`;
  };

  const load = async () => {
    try {
      const res = await fetch(`${API_URL}/about/all`);
      const data = await res.json();
      const item = data.about.find((x) => x._id === id);
      if (item) setForm(item);
    } catch (err) {
      console.error("Error loading About:", err);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const update = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("subtitle", form.subtitle);
    fd.append("description", form.description);

    if (newImage) fd.append("image", newImage);

    try {
      const res = await fetch(`${API_URL}/about/update/${id}`, {
        method: "PUT",
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        alert("Updated Successfully");
        navigate("/admin/about");
      } else {
        alert("Update failed. Check console.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed. Check console.");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-white rounded-xl border shadow max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit About</h1>

        <form className="space-y-5" onSubmit={update}>

          {/* Title */}
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              name="title"
              className="border p-3 w-full rounded"
              value={form.title}
              onChange={handle}
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block font-medium mb-1">Subtitle</label>
            <input
              name="subtitle"
              className="border p-3 w-full rounded"
              value={form.subtitle}
              onChange={handle}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows="4"
              className="border p-3 w-full rounded"
              value={form.description}
              onChange={handle}
              required
            ></textarea>
          </div>

          {/* Current Image */}
          <div>
            <label className="block font-medium mb-1">Current Image</label>
            {form.image ? (
              <img
                src={buildImageUrl(form.image)}
                alt="Current"
                className="w-32 h-32 object-cover rounded border mb-2"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://placehold.co/80x80?text=Not+Found")
                }
              />
            ) : (
              <p>No image uploaded</p>
            )}
          </div>

          {/* Upload New Image */}
          <div>
            <label className="block font-medium mb-1">Upload New Image</label>
            <input
              type="file"
              accept="image/*"
              className="border p-3 w-full rounded"
              onChange={(e) => setNewImage(e.target.files[0])}
            />
            <p className="text-sm text-gray-600 mt-1">
              Leave empty to keep old image.
            </p>
          </div>

          {/* Submit */}
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg w-full hover:bg-green-700 transition">
            Update About
          </button>

        </form>
      </div>
    </AdminLayout>
  );
}