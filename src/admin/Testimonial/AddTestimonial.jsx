import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout";

export default function AddTestimonial() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);

  const handleAdd = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/testimonials/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message, rating }),
    });

    const data = await res.json();
    if (data.success) navigate("/admin/testimonials");
  };

  return (
    <AdminLayout>
        <div className="p-6 flex ">

        <div className="bg-white p-8 rounded-xl shadow-lg border w-full max-w-xl">

          <h1 className="text-3xl font-bold mb-6 text-gray-800">Add Testimonial</h1>


          {/* Form */}
          <form onSubmit={handleAdd} className="space-y-5">

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

           

            {/* Submit */}
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all"
            >
              Add Testimonial
            </button>

          </form>

        </div>
      </div>
    </AdminLayout>
  );
}
