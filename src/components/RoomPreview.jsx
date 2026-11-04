import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import wallImage from "../assets/yourWallImage.png";
import { createAutoWallMask } from "./autoWallMask";

export default function RoomPreview() {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoSize, setPhotoSize] = useState(null);
  const [wallMask, setWallMask] = useState("");
  const [opacity, setOpacity] = useState(66);
  const [showOriginal, setShowOriginal] = useState(false);

  const rawColor = (params.get("color") || "4aa3d1").replace("#", "");
  const selectedColor = `#${/^[0-9a-f]{6}$/i.test(rawColor) ? rawColor : "4aa3d1"}`;
  const texture = params.get("texture") || "";
  const name = params.get("name") || "";
  const uploadedFile = location.state?.uploadedFile;
  const imageSrc = photoUrl || wallImage;

  useEffect(() => {
    if (!uploadedFile) return undefined;
    const url = URL.createObjectURL(uploadedFile);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [uploadedFile]);

  useEffect(() => {
    if (!photoUrl) {
      setWallMask("");
      return undefined;
    }
    let active = true;
    createAutoWallMask(photoUrl).then(result => {
      if (active) setWallMask(result.mask);
    }).catch(() => {
      if (active) setWallMask("");
    });
    return () => { active = false; };
  }, [photoUrl]);

  const photoLoaded = event => setPhotoSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight });
  const ratio = photoSize ? photoSize.width / photoSize.height : 16 / 9;

  return <main className="min-h-screen bg-[#f3f4f1] px-3 py-4 text-[#202822] sm:px-6 sm:py-7 lg:px-8">
    <div className="mx-auto max-w-[1440px]">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-7">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1b342a] text-lg text-white shadow">✦</div><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#96702b]">PREMIUM LOOK TEXTURE</p><h1 className="text-xl font-bold tracking-tight sm:text-2xl">Your Texture Preview</h1></div></div>
        <button type="button" onClick={() => navigate("/")} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#d8ddd7] bg-white px-4 text-sm font-semibold text-[#344238] shadow-sm transition hover:bg-[#f8faf8]"><span aria-hidden="true">←</span> Back to website</button>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-7">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e0e4df] bg-white p-3 shadow-[0_16px_50px_-35px_rgba(25,43,33,.35)] sm:rounded-3xl sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1 sm:px-2"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#96702b]">LIVE ROOM MOCKUP</p><h2 className="mt-0.5 text-base font-bold sm:text-lg">{photoUrl ? "Your wall with a new finish" : "See the finish in a room"}</h2></div>{photoUrl && <span className="rounded-full bg-[#edf4ee] px-3 py-1 text-[10px] font-semibold text-[#31503f] sm:text-xs">Your photo · stays on this device</span>}</div>

          <div className="relative mx-auto w-full max-w-[1050px] overflow-hidden rounded-xl bg-[#ebe8e0] shadow-inner sm:rounded-2xl" style={{ aspectRatio: ratio, width: photoSize ? `min(100%, ${ratio * 68}vh)` : "100%", maxHeight: "68vh" }}>
            <img src={imageSrc} onLoad={photoLoaded} alt={photoUrl ? "Your uploaded wall photo with the selected texture preview" : "Sample room with the selected wall texture"} className="absolute inset-0 h-full w-full object-fill" />
            {!showOriginal && (photoUrl ? <>
              {texture ? <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: `url("${texture}")`, backgroundSize: "32% 42%", backgroundRepeat: "repeat", mixBlendMode: "multiply", opacity: opacity / 100, maskImage: wallMask ? `url("${wallMask}")` : "linear-gradient(#fff,#fff)", WebkitMaskImage: wallMask ? `url("${wallMask}")` : "linear-gradient(#fff,#fff)", maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }} /> : <div aria-hidden="true" className="absolute inset-0" style={{ backgroundColor: selectedColor, opacity: opacity / 100, mixBlendMode: "multiply", maskImage: wallMask ? `url("${wallMask}")` : "linear-gradient(#fff,#fff)", WebkitMaskImage: wallMask ? `url("${wallMask}")` : "linear-gradient(#fff,#fff)", maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }} />}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-50/10 via-transparent to-black/10" style={{ maskImage: wallMask ? `url("${wallMask}")` : "linear-gradient(#fff,#fff)", WebkitMaskImage: wallMask ? `url("${wallMask}")` : "linear-gradient(#fff,#fff)", maskSize: "100% 100%", WebkitMaskSize: "100% 100%", mixBlendMode: "soft-light" }} />
            </> : <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                {texture && <pattern id="wallTexturePattern" patternUnits="userSpaceOnUse" width="25" height="25"><image href={texture} x="0" y="0" width="25" height="25" preserveAspectRatio="xMidYMid slice" /></pattern>}
                <linearGradient id="wallLightFalloff" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fff8e8" stopOpacity="0.24"/><stop offset="48%" stopColor="#fff" stopOpacity="0.02"/><stop offset="100%" stopColor="#17130e" stopOpacity="0.2"/></linearGradient>
              </defs>
              <polygon points="26,4 100,4 100,84 26,84" fill={texture ? "url(#wallTexturePattern)" : selectedColor} opacity={Math.min(opacity / 100, 0.88)} style={{ mixBlendMode: "multiply" }} />
              <polygon points="26,4 100,4 100,84 26,84" fill="url(#wallLightFalloff)" opacity="0.22" style={{ mixBlendMode: "soft-light" }} />
            </svg>)}
            {!photoUrl && <div className="pointer-events-none absolute left-[26%] top-[4%] h-[80%] w-[74%] border border-white/70" />}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/65 via-black/20 to-transparent px-3 pb-3 pt-10 sm:px-4 sm:pb-4">
              <div className="min-w-0"><p className="text-[9px] font-semibold uppercase tracking-[.16em] text-white/75 sm:text-[10px]">{photoUrl ? "YOUR WALL PREVIEW" : "FEATURE WALL"}</p><p className="mt-0.5 truncate text-sm font-semibold text-white sm:text-base">{name || "A finish made for your space"}</p></div>
              {photoUrl && <span className="shrink-0 rounded-full border border-white/40 bg-white/15 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur sm:text-xs">Instant preview</span>}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1 sm:px-2">
            <p className="text-[10px] leading-5 text-gray-500 sm:text-xs">{photoUrl ? "Wall is highlighted automatically · photo stays on this device." : "This room mockup gives you a quick idea of the selected finish."}</p>
            {photoUrl && <button type="button" onClick={() => setShowOriginal(value => !value)} className="shrink-0 rounded-lg border border-[#d8ddd7] px-3 py-2 text-xs font-semibold text-[#344238] transition hover:bg-[#f3f5f1]">{showOriginal ? "Show texture" : "View original"}</button>}
          </div>
        </section>

        <aside className="rounded-2xl border border-[#e0e4df] bg-white p-4 shadow-[0_16px_50px_-35px_rgba(25,43,33,.35)] sm:rounded-3xl sm:p-5 lg:sticky lg:top-5">
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#96702b]">YOUR SELECTION</p><h2 className="mt-1 text-xl font-bold">{name || "Wall finish"}</h2><p className="mt-1 text-sm leading-6 text-gray-600">Your chosen finish is previewed on the wall automatically.</p>
          {texture && <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#f5f5f1] p-2.5"><img src={texture} alt="Selected wall texture sample" className="h-14 w-16 rounded-lg object-cover"/><div className="min-w-0"><p className="text-xs font-semibold text-gray-500">SELECTED FINISH</p><p className="truncate text-sm font-semibold">{name || "Custom texture"}</p></div></div>}
          {photoUrl ? <label className="mt-5 block text-xs font-semibold text-gray-700">Texture strength <span className="float-right font-medium text-gray-500">{opacity}%</span><input type="range" min="25" max="90" value={opacity} onChange={event => setOpacity(Number(event.target.value))} className="mt-2 w-full accent-[#8b681f]"/></label> : <div className="mt-4 rounded-xl border border-[#e5e6df] bg-[#fafaf7] p-3"><p className="text-sm font-bold">Try this finish on your own wall</p><p className="mt-1 text-xs leading-5 text-gray-600">Upload a wall photo in the Texture Studio and your preview appears automatically.</p></div>}
          <p className="mt-4 rounded-xl bg-[#edf4ee] px-3 py-2.5 text-xs leading-5 text-[#31503f]">Your photo stays on this device. Lighting and the actual wall can affect the final appearance.</p>
          <button type="button" onClick={() => navigate("/")} className="mt-4 min-h-11 w-full rounded-xl bg-[#1b342a] px-4 py-2.5 text-sm font-bold text-white shadow transition hover:bg-[#274938]">Explore more finishes</button>
        </aside>
      </div>
    </div>
  </main>;
}
