import { useSearchParams, useNavigate } from "react-router-dom";
import wallImage from "../assets/yourWallImage.png";

export default function RoomPreview() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const hex = params.get("color") || "4aa3d1";
  const selectedColor = `#${hex}`;

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative overflow-hidden">

      {/* MAIN PREVIEW */}
      <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 lg:px-8">

        {/* bigger container for large screens */}
        <div className="relative w-full max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px]">

          <div className="relative w-full aspect-[16/9] max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">

            {/* IMAGE */}
            <img
              src={wallImage}
              alt="Wall Preview"
              className="absolute inset-0 w-full h-full object-contain md:object-cover"
            />

          {/* COLOR OVERLAY */}
<svg
  className="absolute inset-0 w-full h-full pointer-events-none"
  viewBox="0 0 100 100"
  preserveAspectRatio="xMidYMid slice"
>
  <rect
    x="26"
    y="4"
    width="78"
    height="65"   // <-- reduced from 70 to 60`
    fill={selectedColor}
    opacity="0.95"
  />
</svg>


            {/* INNER SHADOW */}
            <div className="absolute inset-0 pointer-events-none shadow-inner rounded-3xl" />

          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 border border-white/40">

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="font-medium">Color:</span>
            <span className="font-semibold">{selectedColor}</span>
            <span
              className="w-4 h-4 rounded-full border shadow-sm"
              style={{ backgroundColor: selectedColor }}
            />
          </div>

          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-full bg-gray-900 text-white text-sm font-medium
              hover:bg-black hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow"
          >
            ← Back to Website
          </button>
        </div>
      </div>

    </section>
  );
}


