import { useNavigate, useSearchParams } from "react-router-dom";
import wallImage from "../assets/yourWallImage.png";

export default function RoomPreview() {
  const [params]=useSearchParams();
  const navigate=useNavigate();
  const rawColor=(params.get("color")||"d7c6ad").replace("#","");
  const hex=/^[0-9a-f]{6}$/i.test(rawColor)?`#${rawColor}`:"#d7c6ad";
  const texture=params.get("texture")||"";
  const name=params.get("name")||"";
  const validTexture=/^https:\/\/res\.cloudinary\.com\//i.test(texture);
  return <main className="min-h-screen bg-[#101b1a] px-3 pb-6 pt-5 text-[#f7f3eb] sm:px-6 sm:pt-8">
    <div className="mx-auto max-w-7xl">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-4 sm:mb-7"><div><p className="text-xs font-semibold uppercase tracking-[.25em] text-[#d0ae77]">PREMIUM LOOK TEXTURE</p><h1 className="mt-2 font-serif text-2xl sm:text-3xl">Preview on your wall</h1></div><button type="button" onClick={()=>navigate('/#gallery')} className="min-h-11 rounded-full border border-white/20 px-5 font-medium text-white/90 transition hover:border-[#d0ae77] hover:text-[#e1c38c]">← Back to gallery</button></header>
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#192725] shadow-[0_28px_90px_rgba(0,0,0,.45)] sm:rounded-3xl">
        <div className="relative aspect-video w-full"><img src={wallImage} alt="Room with a blank wall for finish preview" className="absolute inset-0 h-full w-full object-cover" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-label={validTexture?`${name} texture on wall`:`${name||'Selected paint colour'} on wall`}>
            <defs>{validTexture?<pattern id="wallTexture" patternUnits="userSpaceOnUse" width="480" height="480"><image href={texture} x="0" y="0" width="480" height="480" preserveAspectRatio="xMidYMid slice" /></pattern>:null}<linearGradient id="wallLight" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="white"/><stop offset="1" stopColor="#172321"/></linearGradient></defs>
            <rect x="500" y="0" width="1420" height="912" fill={validTexture?"url(#wallTexture)":hex} opacity={validTexture?"0.86":"0.66"} style={{mixBlendMode:"multiply"}} />
            <rect x="500" y="0" width="1420" height="912" fill="url(#wallLight)" opacity=".08" />
          </svg>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
        </div>
        <footer className="flex flex-col gap-4 border-t border-white/10 bg-[#172321] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><p className="text-xs uppercase tracking-[.2em] text-[#c9a66a]">SELECTED FINISH</p><p className="mt-1 text-lg font-semibold">{name|| (validTexture?'Wall texture':'Paint colour')}</p></div><div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-2"><span className="h-6 w-6 rounded-full border border-white/25" style={validTexture?{backgroundImage:`url("${texture}")`,backgroundSize:'cover'}:{backgroundColor:hex}}/><span className="text-sm text-white/65">{validTexture?'Texture preview':hex}</span></div></footer>
      </div>
      <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-6 text-white/50">Screen colour and texture may vary with lighting and display settings. Ask us for a sample before choosing a final finish.</p>
    </div>
  </main>;
}
