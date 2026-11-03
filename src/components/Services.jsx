import { useEffect,useState } from "react";
import { motion } from "framer-motion";
import { FaBrush,FaBuilding,FaPalette,FaLayerGroup,FaSearch } from "react-icons/fa";

const icons=[FaBrush,FaBuilding,FaPalette,FaLayerGroup,FaSearch];
export default function Services(){
 const API_URL=import.meta.env.VITE_API_URL||"/api";
 const [services,setServices]=useState([]);
 useEffect(()=>{let active=true;fetch(`${API_URL}/services/all`).then(response=>response.json()).then(data=>{if(active&&data.success)setServices(data.services||[]);}).catch(()=>{});return()=>{active=false};},[API_URL]);
 return <section id="services" className="relative overflow-hidden bg-white py-20 sm:py-28"><div className="pointer-events-none absolute -left-48 top-24 h-96 w-96 rounded-full bg-[#c9a66a]/10 blur-3xl"/><div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <header className="mx-auto mb-12 max-w-3xl text-center sm:mb-16"><p className="text-xs font-semibold uppercase tracking-[.25em] text-[#947448]">FROM FIRST IDEA TO FINAL COAT</p><h2 className="mt-3 font-serif text-4xl font-medium text-[#172421] sm:text-5xl">Care in every detail</h2><p className="mt-4 text-base leading-7 text-[#626c66] sm:text-lg">Professional finish, careful preparation and a team that respects your space.</p><div className="mx-auto mt-6 h-px w-16 bg-[#c9a66a]"/></header>
  {services.length>0&&<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{services.map((service,index)=>{const Icon=icons[index%icons.length];return <motion.article key={service._id} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.4,delay:Math.min(index*.06,.24)}} className="rounded-2xl border border-[#e9e5dc] bg-[#fbfaf7] p-6 transition hover:border-[#cfb784] hover:bg-white hover:shadow-[0_16px_40px_rgba(25,37,31,.08)] sm:p-8"><span className="mb-6 grid h-12 w-12 place-items-center rounded-full bg-[#eee6d8] text-lg text-[#84683e]"><Icon/></span><h3 className="font-serif text-2xl font-medium text-[#172421]">{service.title}</h3><p className="mt-3 leading-7 text-[#626c66]">{service.description}</p></motion.article>})}</div>}
 </div></section>;
}
