import { useEffect, useState } from "react";

export default function Gallery() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/gallery`).then(response => response.json()).then(data => {
      if (active && data.success && Array.isArray(data.colors)) setItems(data.colors);
    }).catch(error => console.error("Fetch error:", error)).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [API_URL]);

  const openPreview = params => {
    const query = new URLSearchParams(params);
    window.open(`/room-preview?${query.toString()}`, "_blank", "noopener,noreferrer");
  };
  const textures = items.filter(item => item.type === "texture" || Boolean(item.image));
  const colors = items.filter(item => !item.image && item.type !== "texture");

  return <section className="bg-gray-50 py-10 sm:py-14">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-center text-2xl font-extrabold leading-tight text-gray-800 sm:mb-12 sm:text-3xl md:text-4xl">
        <span className="text-black">Explore Our</span>{" "}<span className="text-yellow-500">Premium</span><br/>
        <span className="text-red-500">Textures</span>{" "}<span className="text-black">&</span>{" "}<span className="text-blue-500">Colours</span>
      </h2>
      {loading?<p className="py-8 text-center text-gray-600">Loading gallery…</p>:textures.length>0&&<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">{textures.map(item=><article key={item._id} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"><button type="button" onClick={()=>openPreview({texture:item.image,name:item.name})} className="relative block aspect-[4/3] w-full overflow-hidden text-left"><img src={item.image} alt={`${item.name} texture`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/><span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-12 text-white"><span className="text-lg font-bold">{item.name}</span><span className="rounded-full bg-yellow-500 px-3 py-2 text-sm font-semibold text-black">View on wall ↗</span></span></button></article>)}</div>}
      {!loading&&!textures.length&&<p className="mb-5 text-center text-gray-600">No textures have been added yet.</p>}
      <details className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-gray-800 sm:px-6"><span><span className="block text-lg font-bold sm:text-xl">Explore paint colours</span><span className="mt-1 block text-sm text-gray-500">Click to view colour shades on the room wall.</span></span><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gray-100 text-2xl text-blue-600 transition-transform details-toggle">+</span></summary>
        <div className="border-t border-gray-100 p-5 sm:p-6">{loading?<p className="py-4 text-center text-gray-600">Loading colours…</p>:colors.length===0?<p className="py-4 text-center text-gray-600">No colours have been added.</p>:<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6">{colors.map(color=><button type="button" key={color._id} onClick={()=>openPreview({color:(color.hex||"").replace("#",""),name:color.name})} className="group text-center transition-transform hover:-translate-y-1"><span className="relative block h-24 w-full overflow-hidden rounded-xl border border-gray-200 shadow-md sm:h-28 md:h-32" style={{backgroundColor:color.hex}}><span className="absolute inset-0 bg-black/10 opacity-0 transition group-hover:opacity-25"/></span><span className="mt-2 block truncate text-sm font-semibold text-gray-800 sm:text-base">{color.name}</span><span className="block text-xs uppercase text-gray-500 sm:text-sm">{color.hex}</span></button>)}</div>}</div>
      </details>
    </div>
  </section>;
}
