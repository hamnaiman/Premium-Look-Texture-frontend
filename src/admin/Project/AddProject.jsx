import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout";

export default function AddProject() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", description: "" });
  const [images, setImages] = useState([]);

  const submit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    images.forEach((img) => fd.append("images", img));

    const res = await fetch(`${API_URL}/projects/add`, {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    if (data.success) navigate("/admin/projects");
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-xl bg-white rounded-xl shadow border mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add Project</h1>

        <form onSubmit={submit} className="space-y-5">

          <input
            placeholder="Project Title"
            className="border p-3 w-full rounded"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            rows="4"
            placeholder="Project Description"
            className="border p-3 w-full rounded"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

       <input
  type="file"
  name="images"
  multiple
  accept="image/*"
  className="border p-3 w-full rounded"
  onChange={(e) => {
    console.log("FILES:", e.target.files);
    setImages(Array.from(e.target.files));
  }}
/>


          <p className="text-sm text-gray-500">
            Upload exactly 3 images
          </p>

          <button className="bg-blue-600 text-white w-full py-3 rounded-lg">
            Add Project
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
