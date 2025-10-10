import Image from "next/image";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhoneAlt,
  FaTelegram,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

interface FooterProps {
  pathname: string;
}

export default function Footer({ pathname }: FooterProps) {
  const quickLinks = [
    { id: 1, text: "Home", href: "/" },
    { id: 2, text: "Courses", href: "/courses" },
    { id: 3, text: "Class 9-12 Academic", href: "courses/class%209-12" },
    { id: 4, text: "Admission", href: "courses/admission" },
    { id: 5, text: "Job Preparation", href: "courses/job%20preparation" },
    { id: 6, text: "Contact", href: "/contact" },
    { id: 7, text: "Login", href: "/login" },
    { id: 8, text: "Register", href: "/register" },
    { id: 9, text: "Dashboard", href: "/dashboard" },
    { id: 10, text: "About Us", href: "/about" },
  ];

  const dontShow =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/management") ||
    pathname.startsWith("/dashboard");

  if (dontShow) {
    return null;
  }

  return (
    <footer className="w-full bg-gradient-to-br from-[#001F3F] via-[#18314a] to-[#001F3F] text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Social Media */}
          <div className="space-y-6">
            <div className="w-40">
              <Image
                src="/assets/logo-removebg-preview.png"
                alt="Suvash Edu logo"
                width={160}
                height={80}
                className="w-full h-auto"
              />
            </div>
            <p className="text-gray-400">
              Empowering students through quality education
            </p>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-myred-secondary transition-colors duration-300"
                >
                  <FaWhatsapp className="text-xl" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-myred-secondary transition-colors duration-300"
                >
                  <FaFacebook className="text-xl" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-myred-secondary transition-colors duration-300"
                >
                  <FaInstagram className="text-xl" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-myred-secondary transition-colors duration-300"
                >
                  <FaYoutube className="text-xl" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-myred-secondary transition-colors duration-300"
                >
                  <FaLinkedin className="text-xl" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-myred-secondary transition-colors duration-300"
                >
                  <FaTelegram className="text-xl" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-myred-secondary transition-colors duration-300"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-myred-secondary" />
                <span>
                  House :93-94, Road 6 Block E, Section 11, Mirpur 11, Dhaka,
                  Bangladesh
                </span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="mr-3 text-myred-secondary" />
                <span>01724-304107</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-myred-secondary" />
                <span>suvasheducation@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to get updates on new courses and offers
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l-lg focus:outline-none text-gray-100 bg-gray-700 ring-2 ring-myred-dark"
              />
              <button
                type="submit"
                className="bg-myred-dark ring-2 ring-myred-dark hover:bg-myred hover:shadow-myred/50 px-4 py-2 rounded-r-lg transition-all duration-300"
              >
                <FaPaperPlane className="text-gray-100" />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-myred/50 mt-8 pt-6 text-center text-gray-400">
          <p>© 2025 All Rights Reserved by Suvash Edu.</p>
        </div>
      </div>
    </footer>
  );
}
