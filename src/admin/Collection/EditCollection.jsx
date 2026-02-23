import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../AdminLayout";

export default function EditCollection() {
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  useEffect(() => {
    fetch(`${API_URL}/collection/all`)
      .then((res) => res.json())
      .then((data) => {
        const item = data.data.find((x) => x._id === id);
        if (item) setForm(item);
      });
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/collection/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description
      })
    });

    const data = await res.json();
    if (data.success) {
      alert("Updated successfully");
      navigate("/admin/collection");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 flex justify-center">
        <div className="bg-white p-8 rounded-xl shadow border w-full max-w-xl">

          <h1 className="text-2xl font-bold mb-6">Edit Collection</h1>

          <form onSubmit={submit} className="space-y-5">

            <div>
              <label className="block font-medium mb-1">Title</label>
              <input
                value={form.title}
                className="border p-3 w-full rounded"
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
                value={form.description}
                className="border p-3 w-full rounded"
                required
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <button className="bg-green-600 text-white w-full py-3 rounded-lg">
              Update Collection
            </button>

          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
