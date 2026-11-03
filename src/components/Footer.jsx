import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp
} from "react-icons/fa";

export default function Footer() {
  const socialLinks = [
    { icon: FaFacebookF, url: "https://www.facebook.com/share/1AW3kYBCD9/" },
    { icon: FaInstagram, url: "https://www.instagram.com/premiumlooktextureofficial?igsh=YzZkZjEzODMzbnZu" },
    { icon: FaLinkedinIn, url: "https://www.linkedin.com/company/premiumlooktexture/" },
    { icon: FaWhatsapp, url: "https://wa.me/923272054430" },
  ];

  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* Decorative Gradients */}
      <div className="absolute -top-16 -left-16 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>

      {/* Top Accent Line */}
      <div className="w-full h-[3px] bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600"></div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-10 md:px-14 py-10 flex flex-col md:flex-row gap-10">

        {/* LEFT — BRAND STORY */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 text-center md:text-left">
            Premium <span className="text-black">Texture</span> <span className="text-black">Paint</span>
          </h2>

          <p className="text-gray-700 text-base leading-relaxed max-w-lg text-center md:text-left">
            We don’t just paint walls, we craft
            <span className="text-blue-600 font-semibold"> premium experiences</span> through
            <span className="text-red-500 font-semibold"> quality coatings</span> and
            <span className="text-purple-600 font-semibold"> artistic textures</span>.
          </p>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-start gap-4 mt-1">
            {socialLinks.map(({ icon: Icon, url }, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full
                           bg-white/80 backdrop-blur shadow-md text-gray-700
                           hover:scale-110 transition"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT — CONTACT CARD */}
        <div className="flex-1 flex justify-center md:justify-end">
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg px-6 py-5 w-full max-w-md">

            {/* Accent */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl"></div>

            <h3 className="text-lg font-bold text-gray-900 mb-3 text-center md:text-left">
              Get in Touch
            </h3>

            <div className="space-y-2 text-gray-700 text-sm text-center md:text-left">
              <p>premiumlooktextureofficial@gmail.com</p>
              <p>+92 327 2054430</p>
              <p>
                 WhatsApp:
                <a
                  href="https://wa.me/923272054430"
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-600 font-semibold ml-1 hover:underline"
                >
                  Chat Now
                </a>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 py-3 text-center">
        <p className="text-gray-600 text-xs tracking-wide">
          © 2025 <span className="text-yellow-500 font-semibold">Premium Texture Paint</span>. All rights reserved.
        </p>
      </div>

    </footer>
  );
}
