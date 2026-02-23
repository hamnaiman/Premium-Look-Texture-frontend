import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../AdminLayout";

export default function ServiceList() {
  const API = import.meta.env.VITE_API_URL;
  const [services, setServices] = useState([]);

  const load = async () => {
    const res = await fetch(`${API}/services/all`);
    const data = await res.json();
    if (data.success) setServices(data.services);
  };

  const del = async (id) => {
    await fetch(`${API}/services/delete/${id}`, { method: "DELETE" });
    load();
  };

  useEffect(()=>{ load(); },[]);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Services</h1>
          <Link to="/admin/services/add" className="bg-blue-600 text-white px-4 py-2 rounded">
            + Add Service
          </Link>
        </div>

        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s=>(
              <tr key={s._id}>
                <td className="p-3 border font-medium">{s.title}</td>
                <td className="p-3 border">{s.description}</td>
                <td className="p-3 border flex gap-2">
                  <Link to={`/admin/services/edit/${s._id}`} className="bg-yellow-500 px-3 py-1 text-white rounded">Edit</Link>
                  <button onClick={()=>del(s._id)} className="bg-red-600 px-3 py-1 text-white rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
