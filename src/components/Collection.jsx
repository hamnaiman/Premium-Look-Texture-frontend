import { useEffect,useState } from "react";
import { motion } from "framer-motion";
import { FaHome,FaSun,FaTree,FaIndustry,FaPalette,FaTint } from "react-icons/fa";

const icons=[FaHome,FaTint,FaSun,FaTree,FaIndustry,FaPalette];
export default function Collection(){
 const API_URL=import.meta.env.VITE_API_URL||"/api";
 const [items,setItems]=useState([]);
 useEffect(()=>{let active=true;fetch(`${API_URL}/collection/all`).then(response=>response.json()).then(data=>{if(active&&data.success)setItems(data.data||[]);}).catch(()=>{});return()=>{active=false};},[API_URL]);
 return <section id="collection" className="bg-[#f4f0e8] py-20 sm:py-28"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <header className="mx-auto mb-12 max-w-3xl text-center sm:mb-16"><p className="text-xs font-semibold uppercase tracking-[.25em] text-[#947448]">DESIGNED AROUND YOU</p><h2 className="mt-3 font-serif text-4xl font-medium text-[#172421] sm:text-5xl">Explore our collection</h2><p className="mt-4 text-base leading-7 text-[#5f6963] sm:text-lg">Thoughtful surfaces and finishes for spaces that feel distinctly yours.</p><div className="mx-auto mt-6 h-px w-16 bg-[#c9a66a]"/></header>
  {items.length>0&&<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((item,index)=>{const Icon=icons[index%icons.length];return <motion.article key={item._id} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.4,delay:Math.min(index*.06,.24)}} className="group relative overflow-hidden rounded-2xl border border-[#e1dbcf] bg-white p-6 shadow-[0_8px_30px_rgba(24,35,30,.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(24,35,30,.1)] sm:p-8"><span className="absolute inset-x-0 top-0 h-1 bg-[#c9a66a] opacity-80 transition group-hover:h-1.5"/><span className="mb-6 grid h-12 w-12 place-items-center rounded-full bg-[#f3eee4] text-lg text-[#947448]"><Icon/></span><h3 className="font-serif text-2xl font-medium text-[#172421]">{item.title}</h3><p className="mt-3 leading-7 text-[#626c66]">{item.description}</p></motion.article>})}</div>}
 </div></section>;
}
