import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout";

export default function AddService() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "" });

  const submit = async (e) => {
    e.preventDefault();
    await fetch(`${API}/services/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    navigate("/admin/services");
  };

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Add Service</h1>

        <form onSubmit={submit} className="space-y-5">
          <input
            placeholder="Service Title"
            className="border p-3 w-full rounded"
            onChange={(e)=>setForm({...form,title:e.target.value})}
            required
          />

          <textarea
            rows="4"
            placeholder="Service Description"
            className="border p-3 w-full rounded"
            onChange={(e)=>setForm({...form,description:e.target.value})}
            required
          />

          <button className="bg-blue-600 text-white w-full py-3 rounded-lg">
            Add Service
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
