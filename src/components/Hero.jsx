import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import wallImage from "../assets/yourWallImage.png";
import premiumLogo from "../assets/premium logo - Edited.png";
import { createAutoWallMask } from "./autoWallMask";

function SparkleIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4"><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" fill="currentColor"/></svg>;
}

export default function Hero() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [hero, setHero] = useState(null);
  const [textures, setTextures] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [customerPhoto, setCustomerPhoto] = useState(null);
  const [customerWallMask, setCustomerWallMask] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [studioOpen, setStudioOpen] = useState(false);
  const fileInput = useRef(null);
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

  useEffect(() => () => {
    if (customerPhoto?.url) URL.revokeObjectURL(customerPhoto.url);
  }, [customerPhoto]);

  useEffect(() => {
    if (!customerPhoto?.url) {
      setCustomerWallMask("");
      return undefined;
    }
    let active = true;
    createAutoWallMask(customerPhoto.url).then(result => {
      if (active) setCustomerWallMask(result.mask);
    }).catch(() => {
      if (active) setCustomerWallMask("");
    });
    return () => { active = false; };
  }, [customerPhoto]);

  useEffect(() => {
    if (!studioOpen) return undefined;
    const closeOnEscape = event => { if (event.key === "Escape") setStudioOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [studioOpen]);

  if (!hero) return null;
  const storedImage = String(hero.bgImage || "");
  const backendUrl = (API_URL || "").replace(/\/api\/?$/, "").replace(/\/+$/, "");
  const imagePath = storedImage.replace(/^\/+/, "");
  const imageSrc = /^https?:\/\//i.test(storedImage)
    ? storedImage
    : `${backendUrl}/${imagePath.startsWith("uploads/") ? imagePath : `uploads/${imagePath}`}`;
  const selected = textures.find(item => item._id === selectedId) || textures[0];
  const textureSrc = item => /^https?:\/\//i.test(item?.image || "") ? item.image : `${backendUrl}/${String(item?.image || "").replace(/^\/+/, "")}`;
  const preview = () => {
    if (!selected) return;
    const query = new URLSearchParams({ texture: textureSrc(selected), name: selected.name });
    navigate(`/room-preview?${query.toString()}`, { state: { uploadedFile: customerPhoto?.file || null } });
  };
  const choosePhoto = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose a JPG, PNG, or other image file.");
      event.target.value = "";
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setPhotoError("Please choose an image smaller than 12 MB.");
      event.target.value = "";
      return;
    }
    setPhotoError("");
    setCustomerPhoto({ file, url: URL.createObjectURL(file) });
  };

  return <section className="relative isolate min-h-[calc(100svh-5rem)] overflow-hidden bg-[#17201d] pb-10 pt-28 sm:pb-12 sm:pt-32 lg:pt-36">
    <img src={imageSrc} alt="Premium wall finish" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101512]/80 via-[#101512]/58 to-[#101512]/28" />
    <div className="mx-auto grid min-h-[calc(100svh-14rem)] w-full max-w-[1440px] items-center gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_.82fr] lg:gap-12 lg:px-12 xl:gap-16 xl:px-16">
      <div className="w-full max-w-[760px] text-center text-white lg:text-left">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-white/90 shadow-sm backdrop-blur sm:text-sm"><SparkleIcon /> Texture, made personal</div>
        <h1 className="mx-auto max-w-4xl text-balance text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl md:text-5xl lg:mx-0 lg:text-[3.1rem] xl:text-[3.55rem]">{hero.title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8 lg:mx-0">{hero.description}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
          {hero.primaryBtnText && <a href={hero.primaryBtnLink || "#contact"} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-yellow-500 px-6 py-3 text-sm font-bold text-gray-950 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-yellow-400 sm:text-base">{hero.primaryBtnText}</a>}
          {hero.secondaryBtnText && <a href={hero.secondaryBtnLink || "#projects"} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/50 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20 sm:text-base">{hero.secondaryBtnText}</a>}
        </div>
        <p className="mt-5 text-xs font-medium tracking-wide text-white/65 sm:text-sm">Thoughtful finishes · Skilled craftsmanship · Made for your space</p>
      </div>

      <aside className="mx-auto w-full max-w-[560px] overflow-hidden rounded-[1.6rem] border border-white/65 bg-[#fbfaf7]/95 p-3.5 shadow-[0_28px_90px_-28px_rgba(0,0,0,.65)] backdrop-blur-md sm:rounded-[1.8rem] sm:p-5 lg:justify-self-end">
        <div className="flex items-center gap-3 px-1 pb-3 sm:px-2 sm:pb-4"><span className="flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white sm:h-12 sm:w-16"><img src={premiumLogo} alt="Premium Look Texture" className="h-full w-full object-contain" /></span><span className="h-8 w-px bg-[#dfded7]"/><span className="min-w-0"><span className="block text-[9px] font-bold uppercase tracking-[.18em] text-[#9a6b16] sm:text-[10px]">PREMIUM LOOK TEXTURE</span><span className="mt-0.5 block text-base font-bold text-[#202622] sm:text-lg">Texture Studio</span></span></div>
        <div className="relative aspect-[1.65/1] overflow-hidden rounded-xl bg-[#dedbd4] shadow-inner sm:rounded-2xl">
          <img src={wallImage} alt="Room preview with a feature wall" className="absolute inset-0 h-full w-full object-cover" />
          {selected && <div aria-hidden="true" className="absolute left-[26%] top-[2%] h-[82%] w-[74%] opacity-90" style={{ backgroundImage: `url("${textureSrc(selected)}")`, backgroundSize: "38% 38%", backgroundPosition: "center", mixBlendMode: "multiply" }} />}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-3 pb-3 pt-9 sm:px-4 sm:pb-4"><div className="min-w-0"><p className="text-[9px] font-semibold uppercase tracking-[.16em] text-white/75">CURRENT FINISH</p><p className="truncate text-sm font-semibold text-white sm:text-base">{selected?.name || "Explore wall finishes"}</p></div><span className="shrink-0 rounded-full border border-white/40 bg-white/15 px-2.5 py-1 text-[9px] font-medium text-white backdrop-blur sm:text-[10px]">LIVE SAMPLE</span></div>
        </div>
        {textures.length > 0 && <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-2.5">{textures.slice(0, 3).map(item => <button key={item._id} type="button" onClick={() => setSelectedId(item._id)} aria-label={`Preview ${item.name}`} aria-pressed={selected?._id === item._id} className={`relative h-12 overflow-hidden rounded-lg border-2 transition sm:h-14 ${selected?._id === item._id ? "border-[#a87920] ring-2 ring-[#a87920]/20" : "border-transparent hover:border-gray-300"}`}><img src={textureSrc(item)} alt="" className="h-full w-full object-cover"/><span className="absolute inset-x-0 bottom-0 truncate bg-black/50 px-1.5 py-1 text-left text-[9px] font-medium text-white sm:text-[10px]">{item.name}</span></button>)}</div>}
        <button type="button" onClick={() => setStudioOpen(true)} className="group mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1b342a] px-4 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#274938] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6b16] focus-visible:ring-offset-2 sm:mt-4 sm:text-base"><SparkleIcon /> Open Texture Studio <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span></button>
      </aside>
    </div>

    {studioOpen && createPortal(<div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#101512]/70 p-2 pt-[max(.5rem,env(safe-area-inset-top))] backdrop-blur-sm sm:p-5" onMouseDown={event => { if (event.target === event.currentTarget) setStudioOpen(false); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="studio-title" className="flex max-h-[96svh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-[#fbfaf7] shadow-2xl sm:rounded-3xl">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#e7e6df] px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3"><img src={premiumLogo} alt="Premium Look Texture" className="h-11 w-14 shrink-0 object-contain sm:h-12 sm:w-16"/><span className="h-9 w-px shrink-0 bg-[#dedfd8]"/><div className="min-w-0"><p className="truncate text-[9px] font-bold uppercase tracking-[.16em] text-[#9a6b16] sm:text-[10px]">PREMIUM LOOK TEXTURE</p><h2 id="studio-title" className="mt-0.5 truncate text-lg font-bold text-[#202622] sm:text-xl">Texture Studio</h2></div></div>
          <button type="button" onClick={() => setStudioOpen(false)} aria-label="Close Texture Studio" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dedfd8] bg-white text-xl text-gray-600 transition hover:bg-gray-100">×</button>
        </header>
        <div className="min-h-0 overflow-y-auto p-3 sm:p-5 lg:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr] lg:gap-7">
            <div className="min-w-0">
              <div className="relative aspect-[1.45/1] overflow-hidden rounded-xl bg-[#dedbd4] shadow-inner sm:rounded-2xl">
                <img src={customerPhoto?.url || wallImage} alt={customerPhoto ? "Your uploaded wall photo" : "Room interior with a feature wall"} className="absolute inset-0 h-full w-full object-cover" />
                {selected && <div aria-hidden="true" className={`absolute inset-0 ${customerPhoto ? "opacity-90 mix-blend-multiply" : "left-[26%] top-[2%] h-[82%] w-[74%] opacity-90 mix-blend-multiply"}`} style={{ backgroundImage: `url("${textureSrc(selected)}")`, backgroundSize: customerPhoto ? "32% 42%" : "38% 38%", backgroundPosition: "center", backgroundRepeat: "repeat", ...(customerPhoto && customerWallMask ? { maskImage: `url("${customerWallMask}")`, WebkitMaskImage: `url("${customerWallMask}")`, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" } : {}) }} />}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-3 pb-3 pt-10 sm:px-4 sm:pb-4"><div className="min-w-0"><p className="text-[9px] font-semibold uppercase tracking-[.16em] text-white/75">{customerPhoto ? "YOUR WALL" : "FEATURE WALL"}</p><p className="truncate text-sm font-semibold text-white">{customerPhoto?.file.name || selected?.name || "Your room preview"}</p></div><span className="shrink-0 rounded-full border border-white/40 bg-white/15 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">LIVE PREVIEW</span></div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-gray-500">{customerPhoto ? "Finish preview updates automatically on your photo." : "Choose a texture to see it on the sample wall."}</p>{customerPhoto && <button type="button" onClick={() => { setCustomerPhoto(null); if (fileInput.current) fileInput.current.value = ""; }} className="text-xs font-semibold text-[#76500f] hover:underline">Remove photo</button>}</div>
            </div>

            <div className="flex min-w-0 flex-col">
              <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-bold text-[#28312b] sm:text-base">Choose a finish</h3><a href="#gallery" onClick={() => setStudioOpen(false)} className="text-xs font-semibold text-[#76500f] underline decoration-[#d1ad67] underline-offset-4">View all textures</a></div>
              {textures.length > 0 ? <div className="mt-3 grid max-h-[min(42vh,390px)] grid-cols-2 gap-2.5 overflow-y-auto overscroll-contain pr-1 sm:gap-3">
                {textures.map((item, index) => <button key={item._id} type="button" onClick={() => setSelectedId(item._id)} aria-label={`Preview ${item.name}`} aria-pressed={selected?._id === item._id} className={`group relative aspect-[1.8/1] overflow-hidden rounded-xl border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${selected?._id === item._id ? "border-[#ad7c20] ring-2 ring-[#ad7c20]/20" : "border-transparent hover:border-gray-300"}`}><img src={textureSrc(item)} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-105"/><span className="absolute inset-x-0 bottom-0 truncate bg-black/50 px-2 py-1.5 text-left text-[10px] font-medium text-white sm:text-xs">{item.name || `Finish ${index + 1}`}</span>{selected?._id === item._id && <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#9a6b16] text-xs font-bold text-white">✓</span>}</button>)}
              </div> : <p className="mt-3 rounded-xl bg-white px-3 py-3 text-sm text-gray-600">New wall finishes are on the way. Browse our work below.</p>}

              <div className="mt-4 rounded-xl border border-dashed border-[#c8c5bb] bg-white/75 p-3 sm:p-4">
                <div className="flex flex-wrap items-center justify-between gap-3"><div className="min-w-0"><p className="text-sm font-semibold text-[#28312b]">Use your own wall photo</p><p className="mt-0.5 text-xs leading-5 text-gray-500">The image stays on this device. Best with a wall-focused photo.</p></div><input ref={fileInput} type="file" accept="image/*" onChange={choosePhoto} className="sr-only" aria-label="Upload a photo of your wall"/><button type="button" onClick={() => fileInput.current?.click()} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-[#c9c4b7] bg-[#fbfaf7] px-3 py-2 text-xs font-semibold text-[#26382e] transition hover:border-[#9a6b16] hover:bg-[#f6f0e4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6b16] sm:text-sm">{customerPhoto ? "Change photo" : "Upload photo"}<span aria-hidden="true">↑</span></button></div>
                {photoError && <p role="alert" className="mt-2 text-xs font-medium text-red-700">{photoError}</p>}
              </div>
              <button type="button" onClick={preview} disabled={!selected} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1b342a] px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#274938] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6b16] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-auto sm:text-base"><SparkleIcon /> {customerPhoto ? "Try this on my wall" : "Try this finish in a room"} <span aria-hidden="true">→</span></button>
            </div>
          </div>
        </div>
      </section>
    </div>, document.body)}
  </section>;
}
