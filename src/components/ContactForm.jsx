import React, { useState } from "react";
import { motion } from "framer-motion";
import paintRoller from "../assets/paint-roller.jpg";

export default function ContactForm() {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("access_key", "d15ac304-ee85-4411-b539-658d431926b0");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      setResult("Message Sent Successfully!");
      event.target.reset();
    } else {
      setResult("Something went wrong!");
    }
  };

  return (
    <section className="relative bg-gray-50 overflow-hidden py-12 sm:py-16 md:py-20">
      {/* Roller Image */}
      <div className="absolute right-[-40px] sm:right-[-80px] md:right-[-100px] top-1/2 -translate-y-1/2 rotate-6 pointer-events-none opacity-90">
        <img
          src={paintRoller}
          className="w-44 sm:w-64 md:w-80 lg:w-[400px] drop-shadow-[0_30px_45px_rgba(0,0,0,0.25)]"
          alt="Paint Roller"
        />
      </div>

      <div className="relative z-10 flex justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-xl sm:max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-4 sm:p-6 md:p-7 my-4"
        >
          {/* Heading */}
          <div className="text-center mb-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
              <span className="text-blue-600">We’re</span>{" "}
              <span className="text-red-500">Here</span>{" "}
              <span className="text-gray-800">for You</span>
            </h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base md:text-base">
              Share your idea and we’ll contact you shortly.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
          >
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm sm:text-sm md:text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition text-sm sm:text-sm md:text-base"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm sm:text-sm md:text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition text-sm sm:text-sm md:text-base"
              />
            </div>

            {/* Subject */}
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-sm sm:text-sm md:text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition text-sm sm:text-sm md:text-base"
              />
            </div>

            {/* Message */}
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-sm sm:text-sm md:text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                rows="4"
                placeholder="Tell us about your project..."
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none resize-none transition text-sm sm:text-sm md:text-base"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-center mt-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8 sm:px-10 py-2 sm:py-2.5 rounded-full shadow-lg tracking-wide w-full sm:w-auto text-sm sm:text-base md:text-base"
              >
                Send Message
              </motion.button>
            </div>

            {/* Result */}
            {result && (
              <div className="md:col-span-2 text-center text-green-600 font-semibold mt-2 text-sm sm:text-base">
                {result}
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
