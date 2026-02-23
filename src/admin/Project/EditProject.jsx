import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../AdminLayout";

export default function EditProject() {
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", description: "" });
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);

  // Build proper image URL (Cloudinary or local)
  const buildImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `${API_URL.replace("/api", "")}/uploads/${img.replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    fetch(`${API_URL}/projects/all`)
      .then((res) => res.json())
      .then((data) => {
        const project = data.projects.find((p) => p._id === id);
        if (project) {
          setForm({
            title: project.title,
            description: project.description,
          });
          setOldImages(project.images || []);
        }
      });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    images.forEach((img) => fd.append("images", img));

    const res = await fetch(`${API_URL}/projects/update/${id}`, {
      method: "PUT",
      body: fd,
    });

    const data = await res.json();
    if (data.success) navigate("/admin/projects");
    else alert("Update failed. Check console for errors.");
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-xl bg-white rounded-xl shadow border mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Project</h1>

        <form onSubmit={submit} className="space-y-5">

          <input
            className="border p-3 w-full rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Project Title"
            required
          />

          <textarea
            rows="4"
            className="border p-3 w-full rounded"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Project Description"
            required
          />

          {/* Old Images */}
          <div className="flex gap-2 flex-wrap">
            {oldImages.length > 0 ? (
              oldImages.map((img, i) => (
                <img
                  key={i}
                  src={buildImageUrl(img)}
                  alt={`Old ${i}`}
                  className="w-24 h-16 object-cover rounded shadow"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://placehold.co/80x50?text=Not+Found")
                  }
                />
              ))
            ) : (
              <p className="text-gray-500 text-sm">No old images</p>
            )}
          </div>

          {/* New Images */}
          <input
            type="file"
            multiple
            accept="image/*"
            className="border p-3 w-full rounded"
            onChange={(e) => setImages([...e.target.files])}
          />
          <p className="text-sm text-gray-500">
            Upload new images to replace old ones
          </p>

          <button className="bg-green-600 text-white w-full py-3 rounded-lg hover:bg-green-700 transition">
            Update Project
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}