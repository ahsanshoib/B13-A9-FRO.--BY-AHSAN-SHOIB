import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-amber-200 border-t border-amber-200 pt-8 pb-4 mt-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-xs text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Welcome to Vintage Rides, your gateway to the golden era of motoring. We are dedicated to
          preserving and sharing the rich heritage of classic automobiles. Our platform connects passionate
          enthusiasts with iconic vehicles, ensuring these masterpieces continue to turn heads. From powerful
          engines to pristine condition, every car tells a story. Join us on a journey through automotive
          history, where every drive is a ride back in time.
        </p>


        {/* Social Icons Section */}
        <div className="flex justify-center gap-5 mt-5 text-xl text-gray-600">
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

        <p className="text-xs text-gray-500 mt-5">
          2025 Vintage Drives® All Right Reserved
        </p>
      </div>
    </footer>
  );
}