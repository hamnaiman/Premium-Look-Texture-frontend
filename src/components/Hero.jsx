import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import wallImage from "../assets/yourWallImage.png";

export default function Hero() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [hero, setHero] = useState(null);
  const [textures, setTextures] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/hero/all`).then(response => response.json()).then(data => {
      if (active && data.success && data.hero?.length) setHero(data.hero[0]);
    }).catch(() => {});
    fetch(`${API_URL}/gallery`).then(response => response.json()).then(data => {
      if (!active || !data.success) return;
      const available = (data.colors || []).filter(item => item.image && item.type === "texture");
      setTextures(available);
      if (available.length) setSelectedId(available[0]._id);
    }).catch(() => {});
    return () => { active = false; };
  }, [API_URL]);

  if (!hero) return null;
  const storedImage = String(hero.bgImage || "");
  const backendUrl = (API_URL || "").replace(/\/api\/?$/, "").replace(/\/+$/, "");
  const imagePath = storedImage.replace(/^\/+/, "");
  const imageSrc = /^https?:\/\//i.test(storedImage)
    ? storedImage
    : `${backendUrl}/${imagePath.startsWith("uploads/") ? imagePath : `uploads/${imagePath}`}`;
  const selected = textures.find(item => item._id === selectedId) || textures[0];
  const preview = () => {
    if (!selected) return;
    const query = new URLSearchParams({ texture: selected.image, name: selected.name });
    navigate(`/room-preview?${query.toString()}`);
  };

  return <section className="relative min-h-screen w-full overflow-hidden py-20 sm:py-24">
    <img src={imageSrc} alt="Decorative wall finish" className="absolute inset-0 h-full w-full object-cover object-center" />
    <div className="absolute inset-0 bg-black/35" />
    <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-6 px-4 pt-12 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:gap-10 lg:px-8">
      <div className="rounded-2xl bg-gray-500/75 px-5 py-7 text-center shadow-xl backdrop-blur-md sm:px-8 sm:py-10 lg:text-left">
        <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">{hero.title}</h1>
        <p className="mx-auto mb-6 max-w-2xl text-sm text-gray-100 sm:text-base md:text-lg lg:mx-0">{hero.description}</p>
        <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
          {hero.primaryBtnText&&<a href={hero.primaryBtnLink||"#contact"} className="rounded-md bg-yellow-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400 sm:text-base">{hero.primaryBtnText}</a>}
          {hero.secondaryBtnText&&<a href={hero.secondaryBtnLink||"#projects"} className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:text-base">{hero.secondaryBtnText}</a>}
        </div>
      </div>

      <aside className="mx-auto w-full max-w-xl rounded-2xl border border-white/70 bg-white/95 p-4 shadow-2xl sm:p-5">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-blue-700">YOUR ROOM PREVIEW</p><h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">See it on your wall</h2></div><span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-amber-900">Texture studio</span></div>
        <p className="mb-4 text-sm leading-6 text-gray-600">Choose one of our finishes and preview how it could look in your space.</p>
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-inner">
          <img src={wallImage} alt="Room mockup with a preview wall" className="absolute inset-0 h-full w-full object-cover" />
          {selected&&<div aria-hidden="true" className="absolute left-[26%] top-[2%] h-[82%] w-[74%] opacity-90" style={{backgroundImage:`url("${selected.image}")`,backgroundSize:"38% 38%",backgroundPosition:"center",mixBlendMode:"multiply"}}/>}
          <span className="absolute bottom-2 left-2 rounded-md bg-black/65 px-2.5 py-1 text-xs font-medium text-white">{selected?.name||"Your wall preview"}</span>
        </div>
        {textures.length>0?<label className="mt-4 block"><span className="sr-only">Choose wall texture</span><select value={selectedId} onChange={event=>setSelectedId(event.target.value)} className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">{textures.map(item=><option key={item._id} value={item._id}>{item.name}</option>)}</select></label>:<p className="mt-4 rounded-lg bg-gray-50 px-3 py-3 text-sm text-gray-600">New wall textures are on the way. Browse our work below.</p>}
        <button type="button" onClick={preview} disabled={!selected} className="mt-3 min-h-12 w-full rounded-lg bg-yellow-500 px-4 py-3 font-bold text-gray-900 shadow transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60">Preview this finish on my wall</button>
        <a href="#gallery" className="mt-3 block text-center text-sm font-semibold text-blue-700 hover:underline">Explore all textures and colours</a>
      </aside>
    </div>
  </section>;
}
