import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../AdminLayout";

export default function TestimonialList() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [testimonials, setTestimonials] = useState([]);

  const load = async () => {
    const res = await fetch(`${API_URL}/testimonials/all`);
    const data = await res.json();
    if (data.success) setTestimonials(data.testimonials);
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;

    const res = await fetch(`${API_URL}/testimonials/delete/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (data.success) load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">

        {/* Page Header */}
        <div className="p-6 bg-gradient-to-r from-gray-100 to-white rounded-xl mb-8 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black">Testimonials</h1>
              <p className="text-gray-800 mt-2">
                Manage customer testimonials and feedback.
              </p>
            </div>

            <Link
              to="/admin/testimonials/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
            >
              + Add Testimonial
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white border rounded-xl shadow">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Message</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {testimonials.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50 transition">

                  <td className="p-3 border font-medium">
                    {t.name}
                  </td>

                  <td className="p-3 border text-gray-700">
                    {t.message.length > 80
                      ? t.message.substring(0, 80) + "..."
                      : t.message}
                  </td>

                  <td className="p-3 border">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/testimonials/edit/${t._id}`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteTestimonial(t._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {testimonials.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center p-5 text-gray-600">
                    No testimonials found.
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
