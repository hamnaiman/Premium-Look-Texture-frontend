import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/premium logo - Edited.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Collection", href: "#collection" },
    { name: "Gallery", href: "#gallery" },
    { name: "Services", href: "#services" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
<nav className="fixed top-0 left-0 w-full z-50 bg-gray-50 backdrop-blur-lg shadow-sm">
  <div className="max-w-7xl mx-auto px-4  flex items-center justify-between">

   {/* Logo + Brand */}
<div className="flex items-center gap-2 cursor-pointer">
  <img
    src={logo}
    alt="Premium Texture Paint"
    className="w-16 h-16 object-contain" // reduced from w-20 h-20
  />
</div>

    {/* Desktop Menu */}
    <ul className="hidden lg:flex items-center gap-6 font-medium ml-auto text-sm">
      {navItems.map((item) => (
        <li key={item.name} className="relative group">
          <a
            href={item.href}
            className="text-gray-800 hover:text-black transition"
          >
            {item.name}
          </a>
          <span className="absolute left-1/2 -bottom-1 h-[2px] w-0 bg-yellow-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
        </li>
      ))}
    </ul>

    {/* Mobile Menu Button */}
    <div
      className="lg:hidden cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <motion.div
        animate={{ rotate: open ? 90 : 0 }}
        className="space-y-1"
      >
        <span className="block w-5 h-0.5 bg-gray-800 rounded-full"></span>
        <span className="block w-5 h-0.5 bg-gray-800 rounded-full"></span>
        <span className="block w-5 h-0.5 bg-gray-800 rounded-full"></span>
      </motion.div>
    </div>
  </div>

  {/* Mobile Menu */}
<AnimatePresence>
  {open && (
    <motion.ul
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="lg:hidden bg-white/95 backdrop-blur-md shadow-md px-4 py-2 
                 space-y-2 text-sm font-medium text-center"
    >
      {navItems.map((item) => (
        <li key={item.name} className="border-b last:border-b-0">
          <a
            href={item.href}
            onClick={() => setOpen(false)}
            className="block w-full py-2 text-gray-800 hover:text-black transition"
          >
            {item.name}
          </a>
        </li>
      ))}
    </motion.ul>
  )}
</AnimatePresence>

</nav>




  );
}
