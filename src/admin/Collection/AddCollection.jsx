import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout";

export default function AddCollection() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  const submit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/collection/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (data.success) {
      alert("Collection added");
      navigate("/admin/collection");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 flex justify-center">
        <div className="bg-white p-8 rounded-xl shadow border w-full max-w-xl">

          <h1 className="text-2xl font-bold mb-6">Add Collection</h1>

          <form onSubmit={submit} className="space-y-5">

            <div>
              <label className="block font-medium mb-1">Title</label>
              <input
                className="border p-3 w-full rounded"
                placeholder="Collection Title"
                required
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                rows="4"
                className="border p-3 w-full rounded"
                placeholder="Short description"
                required
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <button className="bg-blue-600 text-white w-full py-3 rounded-lg">
              Add Collection
            </button>

          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
