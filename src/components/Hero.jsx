import { useEffect, useState } from "react";

export default function Hero(){
 const API_URL=import.meta.env.VITE_API_URL||"/api";
 const [hero,setHero]=useState(null);
 useEffect(()=>{let active=true;fetch(`${API_URL}/hero/all`).then(response=>response.json()).then(data=>{if(active&&data.success&&data.hero?.length)setHero(data.hero[0]);}).catch(()=>{});return()=>{active=false};},[API_URL]);
 if(!hero)return <section className="h-[85vh] min-h-[560px] bg-[#101b1a]" aria-label="Premium wall finishes"/>;
 const origin=API_URL.replace(/\/api\/?$/,"");
 return <section id="home" className="relative flex min-h-[680px] h-[100svh] max-h-[1000px] w-full items-center overflow-hidden bg-[#101b1a] pt-20 sm:pt-24">
  <img src={`${origin}/uploads/${hero.bgImage}`} alt="Premium decorative wall texture" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-center"/>
  <div className="absolute inset-0 bg-gradient-to-r from-[#0c1716]/85 via-[#0c1716]/58 to-[#0c1716]/10"/><div className="absolute inset-0 bg-gradient-to-t from-[#101b1a]/50 via-transparent to-black/10"/>
  <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10"><div className="max-w-3xl text-left">
   <p className="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[.28em] text-[#e1c38c] sm:text-sm"><span className="h-px w-9 bg-[#c9a66a]"/>Premium wall finishes</p>
   <h1 className="font-serif text-4xl font-medium leading-[1.12] text-white sm:text-6xl lg:text-7xl">{hero.title}</h1>
   <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">{hero.description}</p>
   <div className="mt-9 flex flex-wrap gap-3">{hero.primaryBtnText&&<a href={hero.primaryBtnLink||"#gallery"} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#c9a66a] px-6 py-3 text-sm font-bold text-[#14201d] shadow-lg transition hover:bg-[#dfc18b] sm:px-7">{hero.primaryBtnText}</a>}{hero.secondaryBtnText&&<a href={hero.secondaryBtnLink||"#projects"} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/50 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white hover:bg-white/15 sm:px-7">{hero.secondaryBtnText}</a>}</div>
   <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/20 pt-5 text-xs font-medium uppercase tracking-[.16em] text-white/65 sm:text-sm"><span>Crafted textures</span><span>Skilled application</span><span>Made for your space</span></div>
  </div></div>
 </section>;
}
