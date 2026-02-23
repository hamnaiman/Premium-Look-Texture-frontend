import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout";

export default function GalleryAdd() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [name, setName] = useState("");
  const [hex, setHex] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/gallery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, hex }),
    });

    const data = await res.json();
    if (data.success) navigate("/admin/gallery");
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Color</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md border grid gap-5"
        >
          <div>
            <label className="block text-gray-700 mb-1">Color Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Royal Gold"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Hex Code</label>
            <input
              type="text"
              required
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="#FFD700"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Save Color
          </button>
        </form>

      </div>
    </AdminLayout>
  );
}
