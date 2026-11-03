import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout";

export default function GalleryAdd() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [type, setType] = useState("texture");
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#b8925a");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => { if (!image) { setImagePreview(""); return; } const url=URL.createObjectURL(image);setImagePreview(url);return()=>URL.revokeObjectURL(url); }, [image]);
  const submit = async event => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const body = new FormData(); body.append("name", name.trim()); body.append("type", type);
      if (type === "color") body.append("hex", hex);
      if (image) body.append("image", image);
      const response = await fetch(`${API_URL}/gallery`, { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }, body });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not save this item.");
      navigate("/admin/gallery");
    } catch (err) { setError(err.message || "Could not save this item."); }
    finally { setBusy(false); }
  };
  return <AdminLayout><div className="mx-auto max-w-3xl p-2 sm:p-6">
    <div className="mb-6"><p className="text-xs font-semibold uppercase tracking-[.2em] text-amber-700">PREMIUM LOOK TEXTURE</p><h1 className="mt-2 text-3xl font-semibold text-slate-900">Add to the visual gallery</h1><p className="mt-2 text-slate-600">Upload a finish to preview on a room wall, or add a paint colour.</p></div>
    <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm" role="group" aria-label="Gallery item type">
      {[['texture','Wall texture'],['color','Paint colour']].map(([value,label])=><button key={value} type="button" onClick={()=>setType(value)} aria-pressed={type===value} className={`min-h-12 rounded-xl px-3 py-2 font-semibold transition ${type===value?'bg-slate-900 text-white shadow':'text-slate-700 hover:bg-slate-100'}`}>{label}</button>)}
    </div>
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      {error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-red-800">{error}</p>}
      <label className="block"><span className="mb-2 block font-semibold text-slate-800">{type==='texture'?'Texture name':'Colour name'}</span><input required maxLength="100" value={name} onChange={event=>setName(event.target.value)} placeholder={type==='texture'?'e.g. Travertine Sand':'e.g. Warm Ivory'} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100" /></label>
      {type==='texture'?<label className="block"><span className="mb-2 block font-semibold text-slate-800">Texture image</span><input required type="file" accept="image/jpeg,image/png,image/webp" onChange={event=>setImage(event.target.files?.[0]||null)} className="block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-slate-600 file:me-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:font-semibold file:text-white" /><span className="mt-2 block text-sm text-slate-500">JPG, PNG, or WebP. A clear, evenly lit close-up gives the best wall preview.</span>{imagePreview&&<img src={imagePreview} alt="Selected texture preview" className="mt-4 h-48 w-full rounded-xl object-cover" />}</label>:<label className="block"><span className="mb-2 block font-semibold text-slate-800">Paint colour</span><div className="flex items-center gap-3"><input type="color" value={hex} onChange={event=>setHex(event.target.value)} className="h-14 w-16 cursor-pointer rounded-lg border border-slate-200 bg-white p-1" /><input required pattern="^#[0-9A-Fa-f]{6}$" value={hex} onChange={event=>setHex(event.target.value)} className="w-40 rounded-xl border border-slate-300 px-4 py-3 font-mono uppercase" /></div></label>}
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={()=>navigate('/admin/gallery')} className="min-h-12 rounded-xl border border-slate-300 px-5 font-semibold text-slate-700">Cancel</button><button disabled={busy} className="min-h-12 rounded-xl bg-slate-900 px-6 font-semibold text-white hover:bg-slate-800 disabled:opacity-60">{busy?'Uploading…':type==='texture'?'Upload texture':'Save colour'}</button></div>
    </form>
  </div></AdminLayout>;
}
