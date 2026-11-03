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
    <footer className="relative w-full overflow-hidden bg-[#101b1a] text-[#f7f3eb]">

      {/* Decorative Gradients */}
      <div className="absolute -top-16 -left-16 w-72 h-72 bg-[#c9a66a]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-[#62736b]/15 rounded-full blur-3xl"></div>

      {/* Top Accent Line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#c9a66a] to-transparent"></div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-10 md:px-14 py-10 flex flex-col md:flex-row gap-10">

        {/* LEFT — BRAND STORY */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-white text-center md:text-left">
            Premium <span className="text-[#e0c38f]">Look Texture</span>
          </h2>

          <p className="text-white/65 text-base leading-relaxed max-w-lg text-center md:text-left">
            We don’t just paint walls, we craft
            <span className="text-[#e0c38f] font-semibold"> premium experiences</span> through
            <span className="text-white font-semibold"> quality coatings</span> and
            <span className="text-[#e0c38f] font-semibold"> artistic textures</span>.
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
                           bg-white/10 backdrop-blur shadow-md text-white
                           hover:bg-[#c9a66a] hover:text-[#101b1a] transition"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT — CONTACT CARD */}
        <div className="flex-1 flex justify-center md:justify-end">
          <div className="relative bg-white/[.06] border border-white/10 backdrop-blur-xl rounded-2xl px-6 py-5 w-full max-w-md">

            {/* Accent */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#c9a66a]/20 rounded-full blur-xl"></div>

            <h3 className="font-serif text-xl font-medium text-white mb-3 text-center md:text-left">
              Get in Touch
            </h3>

            <div className="space-y-2 text-white/65 text-sm text-center md:text-left">
              <p>premiumlooktextureofficial@gmail.com</p>
              <p>+92 327 2054430</p>
              <p>
                 WhatsApp:
                <a
                  href="https://wa.me/923272054430"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#e0c38f] font-semibold ml-1 hover:underline"
                >
                  Chat Now
                </a>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-4 text-center">
        <p className="text-white/45 text-xs tracking-wide">
          © 2026 <span className="text-[#e0c38f] font-semibold">Premium Look Texture</span>. All rights reserved.
        </p>
      </div>

    </footer>
  );
}
