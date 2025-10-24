"use client";
import { FaWhatsapp } from "react-icons/fa";

function WhatsApp() {
  const phoneNumber = "+8801320582841"; // Your WhatsApp Business Number
  const message = "হ্যালো ! আমি আপনাদের কোর্স গুলো সম্পর্কে আরো জানতে চাই। ."; // Optional message

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber.replace(
      /[^\d]/g,
      ""
    )}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-[9999]"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={28} />
    </button>
  );
}

export default WhatsApp;
