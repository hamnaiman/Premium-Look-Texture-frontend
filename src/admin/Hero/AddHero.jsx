import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout";

export default function AddHero() {
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
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    if (!image) return alert("Hero background image is required");

    setLoading(true);

    try {
      const fd = new FormData();
      Object.keys(form).forEach(key => fd.append(key, form[key]));
      fd.append("bgImage", image);

      const res = await fetch(`${API_URL}/hero/add`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Server error");
      }

      alert("Hero section added successfully");
      navigate("/admin/hero");
    } catch (err) {
      console.error("Add Hero error:", err);
      console.log("API_URL =", API_URL);
      alert("Failed to add hero. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 flex justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg border w-full max-w-3xl">
          <h1 className="text-3xl font-bold mb-4">Add Hero Section</h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
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
              placeholder="Description"
              rows="4"
              className="border p-3 w-full rounded"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                name="primaryBtnText"
                value={form.primaryBtnText}
                onChange={handleChange}
                placeholder="Primary Button Text"
                className="border p-3 w-full rounded"
              />
              <input
                name="primaryBtnLink"
                value={form.primaryBtnLink}
                onChange={handleChange}
                placeholder="Primary Button Link"
                className="border p-3 w-full rounded"
              />
              <input
                name="secondaryBtnText"
                value={form.secondaryBtnText}
                onChange={handleChange}
                placeholder="Secondary Button Text"
                className="border p-3 w-full rounded"
              />
              <input
                name="secondaryBtnLink"
                value={form.secondaryBtnLink}
                onChange={handleChange}
                placeholder="Secondary Button Link"
                className="border p-3 w-full rounded"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={e => setImage(e.target.files[0])}
              className="border p-3 w-full rounded"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded text-white ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : "Add Hero Section"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}