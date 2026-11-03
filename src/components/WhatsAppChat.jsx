import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppChat() {
  return <a
    href="https://wa.me/923272054430"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with us on WhatsApp"
    className="fixed bottom-5 right-5 z-[80] inline-flex min-h-14 items-center gap-3 rounded-full bg-[#25D366] px-5 py-3 text-base font-semibold text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#1fb85a] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
  >
    <FaWhatsapp aria-hidden="true" className="h-7 w-7" />
    <span>Chat Now</span>
  </a>;
}
