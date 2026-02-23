import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../AdminLayout";

export default function GalleryList() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchColors = async () => {
    try {
      const res = await fetch(`${API_URL}/gallery`);
      const data = await res.json();
      if (data.success) setColors(data.colors);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteColor = async (id) => {
    if (!confirm("Delete this color?")) return;

    await fetch(`${API_URL}/gallery/${id}`, {
      method: "DELETE",
    });

    fetchColors();
  };

  useEffect(() => {
    fetchColors();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">

        <div className="p-6 bg-gray-100 rounded-xl mb-8 border shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black">Gallery Colors</h1>
              <p className="text-gray-800 mt-2">Manage all gallery colors.</p>
            </div>

            <Link
              to="/admin/gallery/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
            >
              + Add Color
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl overflow-hidden border">
          {loading ? (
            <div className="p-6 text-gray-600">Loading...</div>
          ) : colors.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No colors found.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3 text-left">Color Name</th>
                  <th className="p-3 text-left">Hex Code</th>
                  <th className="p-3 text-left">Preview</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {colors.map((c) => (
                  <tr key={c._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">{c.name}</td>
                    <td className="p-3">{c.hex}</td>
                    <td className="p-3">
                      <div
                        className="w-10 h-5 rounded border"
                        style={{ background: c.hex }}
                      ></div>
                    </td>
                    <td className="p-3 flex gap-3">
                      <Link
                        to={`/admin/gallery/edit/${c._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteColor(c._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
