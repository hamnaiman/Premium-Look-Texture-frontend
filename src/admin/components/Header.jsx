import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      
      {/* LEFT SECTION (Logo + Title) */}
      <div className="flex items-center gap-3">
        <ShieldCheckIcon className="h-8 w-8 text-gray-900" />
        
        <div>
          <h1 className="text-lg font-semibold text-black leading-tight">
            Admin Panel
          </h1>
          <p className="text-sm text-gray-600 -mt-1">Premium Texture Paint</p>
        </div>
      </div>

      {/* RIGHT SIDE COLOR STRIPE */}
      <div className="flex gap-1">
        <div className="h-2 w-8 bg-red-500 rounded"></div>
        <div className="h-2 w-8 bg-blue-500 rounded"></div>
        <div className="h-2 w-8 bg-yellow-500 rounded"></div>
      </div>

    </header>
  );
}
