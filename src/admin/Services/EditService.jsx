import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../AdminLayout";

export default function EditService() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");

  const loadService = async () => {
    const res = await fetch(`${API_URL}/services/all`);
    const data = await res.json();

    if (data.success) {
      const s = data.services.find((item) => item._id === id);
      if (s) {
        setTitle(s.title);
        setDescription(s.description);
        setIcon(s.icon);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/services/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, icon }),
    });

    const data = await res.json();
    if (data.success) navigate("/admin/services");
  };

  useEffect(() => {
    loadService();
  }, []);

  return (
    <AdminLayout>
      <div className="flex justify-center p-6">
        <div className="bg-white w-full max-w-md p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-5 text-gray-700">
            Edit Service
          </h1>

          <form onSubmit={handleUpdate}>

            <label className="block mb-2 font-medium text-gray-600">
              Service Title
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label className="block mb-2 font-medium text-gray-600">
              Description
            </label>
            <textarea
              className="w-full p-3 border rounded-lg mb-4 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label className="block mb-2 font-medium text-gray-600">
              Icon Class
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Update Service
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
