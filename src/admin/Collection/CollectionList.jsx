import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../AdminLayout";

export default function CollectionList() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [items, setItems] = useState([]);

  const load = async () => {
    const res = await fetch(`${API_URL}/collection/all`);
    const data = await res.json();
    if (data.success) setItems(data.data);
  };

  const del = async (id) => {
    if (!window.confirm("Delete this collection item?")) return;
    await fetch(`${API_URL}/collection/delete/${id}`, { method: "DELETE" });
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Collection Section</h1>
            <p className="text-gray-600 text-sm">
              Manage collection cards (title & description only)
            </p>
          </div>

          <Link
            to="/admin/collection/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Collection
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white border rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">Title</th>
                <th className="p-3 border text-left">Description</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="p-3 border font-medium">
                    {item.title}
                  </td>

                  <td className="p-3 border text-sm text-gray-700">
                    {item.description.length > 80
                      ? item.description.slice(0, 80) + "..."
                      : item.description}
                  </td>

                  <td className="p-3 border text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/admin/collection/edit/${item._id}`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => del(item._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center p-6 text-gray-500">
                    No collection items found.
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
