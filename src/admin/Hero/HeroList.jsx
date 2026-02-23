import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../AdminLayout";

export default function HeroList() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const load = async () => {
    try {
      const res = await fetch(`${API_URL}/hero/all`);
      const json = await res.json();

      if (json.success) {
        setData(json.hero);
      }
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this Hero section?")) return;

    setLoadingDelete(true);

    try {
      const res = await fetch(`${API_URL}/hero/delete/${id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (json.success) {
        load();
      } else {
        alert(json.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setLoadingDelete(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Hero Section</h1>

          <Link
            to="/admin/hero/add"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Hero
          </Link>
        </div>

        <table className="w-full border bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Image</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((h) => (
              <tr key={h._id}>
                <td className="p-3 border">
                  {h.bgImage && (
                    <img
                      src={h.bgImage}
                      className="w-24 h-14 object-cover rounded"
                      alt=""
                    />
                  )}
                </td>

                <td className="p-3 border">{h.title}</td>

                <td className="p-3 border">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/hero/edit/${h._id}`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => del(h._id)}
                      disabled={loadingDelete}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-4">
                  No hero sections found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}