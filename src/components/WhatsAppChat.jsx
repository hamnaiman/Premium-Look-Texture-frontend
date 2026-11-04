import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppChat() {
  return <a
    href="https://wa.me/923272054430"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with us on WhatsApp"
    className="fixed bottom-4 right-4 z-[80] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] p-3 text-white shadow-xl transition hover:-translate-y-1 hover:scale-105 hover:bg-[#1fb85a] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:bottom-5 sm:right-5 sm:h-16 sm:w-16"
  >
    <FaWhatsapp aria-hidden="true" className="h-8 w-8 sm:h-9 sm:w-9" />
  </a>;
}
