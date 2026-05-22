import Link from "next/link";
import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-amber-200 border-t border-amber-300 pt-12 pb-4 mt-12 relative z-10">
      <div className="max-w-6xl mx-auto px-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-amber-300">
          
          
          <div className="flex flex-col gap-3 md:items-start text-left">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Contact Info</h3>
            <ul className="flex flex-col gap-2.5 text-xs text-gray-700">
              {/* Location */}
              <li className="flex items-center gap-2">
                <div className="w-4 flex justify-center">
                    <FaMapMarkerAlt className="text-red-700 text-sm" />
                </div>
                <span>Chankharpul, Dhaka</span>
              </li>
              
              {/* Phone */}
              <li className="flex items-center gap-2">
                 <div className="w-4 flex justify-center">
                    <FaPhoneAlt className="text-red-700 text-xs" />
                 </div>
                <span>+880 1876 543210</span>
              </li>
              
              {/* Envelope */}
              <li className="flex items-center gap-2">
                <div className="w-4 flex justify-center">
                    <FaEnvelope className="text-red-700 text-xs" />
                </div>
                <span>support@vintagerides.com</span>
              </li>
            </ul>
          </div>

        
          <div className="flex flex-col gap-3 md:items-center text-center relative z-30">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Useful Links</h3>
            <ul className="flex flex-col gap-2 text-xs text-gray-700 font-medium">
              <li>
                <Link href="/" className="hover:text-red-700 transition">Home</Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-red-700 transition">Explore Cars</Link>
              </li>
            </ul>
          </div>

          
          <div className="flex flex-col gap-3 md:items-end text-left md:text-right">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">About Us</h3>
            <p className="text-xs text-gray-700 leading-relaxed max-w-sm">
              Welcome to Vintage Rides, your gateway to the golden era of motoring. We are dedicated to
              preserving and sharing the rich heritage of classic automobiles. Join us on a journey through automotive
              history, where every drive is a ride back in time.
            </p>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <p className="text-xs text-gray-600 order-2 sm:order-1">
            © 2026 Vintage Drives® All Rights Reserved
          </p>

          <div className="flex items-center gap-5 text-xl text-gray-500 order-1 sm:order-2">
            <a 
              href="https://www.facebook.com/groups/1559222020902739/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-red-700 transition"
            >
              <FaFacebook />
            </a>
            <a 
              href="https://www.instagram.com/rentacar/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-red-700 transition"
            >
              <FaInstagram />
            </a>
            <a 
              href="https://x.com/CarRenting" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-red-700 transition"
            >
              <FaXTwitter />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}