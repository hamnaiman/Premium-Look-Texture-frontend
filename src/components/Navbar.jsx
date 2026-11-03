import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../assets/premium logo - Edited.png";

const navItems=[{name:"Home",href:"#home"},{name:"About",href:"#about"},{name:"Collection",href:"#collection"},{name:"Finishes",href:"#gallery"},{name:"Services",href:"#services"},{name:"Projects",href:"#projects"},{name:"Contact",href:"#contact"}];
export default function Navbar(){
 const [open,setOpen]=useState(false);
 return <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#101b1a]/90 text-white shadow-[0_8px_30px_rgba(0,0,0,.15)] backdrop-blur-xl">
  <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[88px] lg:px-8">
   <a href="#home" className="flex min-w-0 items-center gap-3" aria-label="Premium Look Texture home"><img src={logo} alt="" className="h-14 w-14 object-contain sm:h-16 sm:w-16"/><span className="min-w-0"><span className="block truncate font-serif text-lg font-semibold tracking-wide sm:text-xl">Premium Look</span><span className="block text-[9px] uppercase tracking-[.24em] text-[#d0ae77] sm:text-[10px]">Texture & finish</span></span></a>
   <ul className="ml-auto hidden items-center gap-6 lg:flex">{navItems.map(item=><li key={item.name}><a href={item.href} className="group relative py-2 text-[13px] font-medium text-white/75 transition hover:text-[#e3c48f]">{item.name}<span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[#c9a66a] transition-transform group-hover:scale-x-100"/></a></li>)}<li><a href="#contact" className="rounded-full border border-[#c9a66a]/70 px-4 py-2 text-[13px] font-semibold text-[#f0d7aa] transition hover:bg-[#c9a66a] hover:text-[#101b1a]">Request a quote</a></li></ul>
   <button type="button" className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-xl text-white lg:hidden" onClick={()=>setOpen(value=>!value)} aria-label={open?"Close menu":"Open menu"} aria-expanded={open}>{open?"×":"☰"}</button>
  </div>
  <AnimatePresence>{open&&<motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} className="overflow-hidden border-t border-white/10 bg-[#101b1a] lg:hidden"><ul className="mx-auto max-w-7xl px-4 py-3 sm:px-6">{navItems.map(item=><li key={item.name} className="border-b border-white/10 last:border-0"><a href={item.href} onClick={()=>setOpen(false)} className="block py-3 text-sm text-white/80 hover:text-[#e3c48f]">{item.name}</a></li>)}<li className="pt-3"><a href="#contact" onClick={()=>setOpen(false)} className="block rounded-full bg-[#c9a66a] px-4 py-3 text-center font-semibold text-[#101b1a]">Request a quote</a></li></ul></motion.div>}</AnimatePresence>
 </nav>;
}
