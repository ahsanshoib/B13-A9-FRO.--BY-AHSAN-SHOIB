"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 
  const [isMounted, setIsMounted] = useState(false); 
  
  const dropdownRef = useRef(null); 
  const mobileMenuRef = useRef(null); 
  

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            setDropdownOpen(false);
            setMobileMenuOpen(false);
            toast.success("Logged out successfully");
            router.push("/");
            router.refresh();
          }
        }
      });
    } catch {
      toast.error("Something went wrong during logout");
    }
  };

  const linkClass = (href) =>
    `text-sm font-semibold transition hover:text-red-800 ${
      pathname === href ? "text-red-800 border-b-2 border-red-800" : "text-gray-700"
    }`;

  const mobileLinkClass = (href) =>
    `block w-full px-4 py-2.5 text-sm font-semibold rounded-xl transition ${
      pathname === href ? "bg-amber-500 text-white" : "text-gray-700 hover:bg-amber-200/40"
    }`;

  return (
    <nav className="bg-amber-200 shadow-sm px-4 md:px-10 py-3 sticky top-0 z-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/left-logo.png" alt="DriveFleet" width={38} height={38} />
          <div className="leading-tight">
            <p className="text-xs font-bold text-red-800 uppercase tracking-widest">Vintage</p>
            <p className="text-xs font-bold text-red-800 uppercase tracking-widest">Rides</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden lg:flex items-center gap-8">
          <li><Link href="/" className={linkClass("/")}>Home</Link></li>
          <li><Link href="/explore" className={linkClass("/explore")}>Explore</Link></li>
          {isMounted && user && (
            <>
              <li><Link href="/add-car" className={linkClass("/add-car")}>Add Car</Link></li>
              <li><Link href="/my-bookings" className={linkClass("/my-bookings")}>Booking</Link></li>
            </>
          )}
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          
          {/* Desktop User Dropdown Menu */}
          {!isMounted || isPending ? (
            
            <div className="hidden lg:block w-20 h-8" />
          ) : user ? (
            <div className="relative hidden lg:block" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-amber-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-amber-600 transition focus:outline-none"
              >
                <span>{user.name?.split(" ")[0] || "User"}</span>
                <svg className={`w-3 h-3 text-white transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-amber-50 border border-amber-200 shadow-xl rounded-xl z-50 p-2 flex flex-col gap-1">
                  <Link href="/my-profile" onClick={() => setDropdownOpen(false)} className="px-3 py-1.5 text-sm text-amber-950 font-bold hover:bg-amber-200/60 rounded-lg transition text-left">
                    My Profile
                  </Link>
                  <hr className="border-amber-200 my-0.5" />
                  <Link href="/add-car" onClick={() => setDropdownOpen(false)} className="px-3 py-1.5 text-sm text-gray-700 hover:bg-amber-200/50 rounded-lg transition text-left">
                    Add Car
                  </Link>
                  <Link href="/my-bookings" onClick={() => setDropdownOpen(false)} className="px-3 py-1.5 text-sm text-gray-700 hover:bg-amber-200/50 rounded-lg transition text-left">
                    My Bookings
                  </Link>
                  <Link href="/my-cars" onClick={() => setDropdownOpen(false)} className="px-3 py-1.5 text-sm text-amber-800 font-semibold hover:bg-amber-200/50 rounded-lg transition text-left">
                    My Listing
                  </Link>
                  <hr className="border-amber-200 my-1" />
                  <button onClick={handleLogout} className="px-3 py-1.5 text-sm text-red-600 font-bold hover:bg-red-50 rounded-lg transition text-left w-full">
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden lg:block bg-amber-500 text-white text-sm font-semibold px-5 py-1.5 rounded-full hover:bg-amber-600 transition">
              Login
            </Link>
          )}

          {/* Mobile & Tablet Toggle Button */}
          <div className="relative lg:hidden" ref={mobileMenuRef}>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 rounded-xl transition focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Mobile Menu Pop-up */}
            {mobileMenuOpen && isMounted && (
              <div className="absolute right-0 mt-2 w-56 bg-amber-50 border border-amber-200 shadow-2xl rounded-2xl z-50 p-2 flex flex-col gap-1 origin-top-right transition-all">
                
                {user && (
                  <div className="px-4 py-2 bg-amber-500/10 rounded-xl mb-1 text-center">
                    <p className="text-xs text-amber-800 font-bold">Logged in as</p>
                    <p className="text-sm font-black text-gray-800 truncate">{user.name}</p>
                  </div>
                )}

                <Link href="/" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass("/")}>
                  Home
                </Link>
                <Link href="/explore" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass("/explore")}>
                  Explore
                </Link>

                {user ? (
                  <>
                    <hr className="border-amber-200 my-0.5" />
                    <Link href="/my-profile" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass("/my-profile")}>
                      My Profile
                    </Link>
                    <hr className="border-amber-200 my-0.5" />
                    <Link href="/add-car" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass("/add-car")}>
                      Add Car
                    </Link>
                    <Link href="/my-bookings" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass("/my-bookings")}>
                      My Bookings
                    </Link>
                    <Link href="/my-cars" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass("/my-cars")}>
                      My Listing
                    </Link>
                    <hr className="border-amber-200 my-1" />
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <hr className="border-amber-200 my-1" />
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center bg-amber-500 text-white font-bold py-2 rounded-xl text-sm transition hover:bg-amber-600 mx-2 my-1">
                      Login
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}