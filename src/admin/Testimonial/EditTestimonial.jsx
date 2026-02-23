import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../AdminLayout";

export default function EditTestimonial() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);

  const load = async () => {
    const res = await fetch(`${API_URL}/testimonials/all`);
    const data = await res.json();

    if (data.success) {
      const t = data.testimonials.find((item) => item._id === id);
      if (t) {
        setName(t.name);
        setMessage(t.message);
        setRating(t.rating);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/testimonials/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message, rating }),
    });

    const data = await res.json();
    if (data.success) navigate("/admin/testimonials");
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 max-w-xl mx-auto">

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Edit Testimonial
        </h1>

        {/* Card */}
        <div className="bg-white shadow-md border rounded-xl p-6">
          <form onSubmit={handleUpdate} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Customer Name"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                placeholder="Customer Feedback Message"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

        

            {/* Update Button */}
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Update Testimonial
            </button>

          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
