"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import toast from "react-hot-toast";

const RE_USABLE_FALLBACK = "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg";

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookedCars, setBookedCars] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Modal & cancel tracking state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const bookingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, { credentials: "include" });
      if (bookingRes.ok) {
        const data = await bookingRes.json();
        setBookedCars(data);
      } else {
        toast.error("Failed to load bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Function to open the cancel confirmation modal
  const openCancelModal = (bookingId) => {
    setActiveBookingId(bookingId);
    setIsModalOpen(true);
  };

  // Function to confirm trip cancellation from the modal
  const handleConfirmCancel = async () => {
    if (!activeBookingId) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${activeBookingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Trip canceled successfully!");
        setBookedCars(bookedCars.filter((booking) => booking._id !== activeBookingId));
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to cancel trip");
      }
    } catch (error) {
      console.error("Cancel trip error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsModalOpen(false);
      setActiveBookingId(null);
    }
  };

  const getValidImageUrl = (url) => {
    if (!url || url.trim() === "" || url === "HH") return RE_USABLE_FALLBACK;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return url.startsWith("/") ? url : `/${url}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-red-800 text-center uppercase mb-8">
        My Bookings
      </h1>

      {loading ? (
        <Spinner />
      ) : bookedCars.length === 0 ? (
        <div className="text-center bg-amber-50 border border-amber-200 rounded-xl p-10">
          <p className="text-gray-500 mb-4">No booked cars found.</p>
          <button 
            onClick={() => router.push("/explore")} 
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-full transition text-sm"
          >
            Explore Cars to Book
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookedCars.map((booking, index) => {
            const carName = booking.carName || booking.carId?.carName || "Unknown Car";
            const imageUrl = booking.imageUrl || booking.carId?.imageUrl;
            const description = booking.description || booking.carId?.description || "No description available.";
            const rentPrice = booking.dailyRentPrice || booking.carId?.dailyRentPrice;

            // Date and time formatted in clean English (e.g., May 21, 2026, 3:45 PM)
            const formattedDateTime = booking.bookingDate 
              ? new Date(booking.bookingDate).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true
                })
              : "Not Available";

            return (
              <div 
                key={booking._id || index} 
                className="bg-amber-50 border border-amber-200 rounded-2xl shadow p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                  <img
                    src={getValidImageUrl(imageUrl)}
                    alt={carName}
                    className="w-28 h-20 object-cover rounded-xl flex-shrink-0 bg-gray-200"
                    onError={(e) => { e.target.onerror = null; e.target.src = RE_USABLE_FALLBACK; }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-blue-100 text-blue-700">
                        Booked
                      </span>
                      {rentPrice && (
                        <span className="text-xs font-bold text-red-700">
                          BDT{rentPrice.toLocaleString()}/day
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-gray-800 mt-1">{carName}</p>
                    <p className="text-xs text-gray-600 line-clamp-1">{description}</p>
                    
                    {/* English Date & Time Display */}
                    <p className="text-[11px] font-medium text-amber-950 bg-amber-200/50 inline-block px-2 py-1 rounded-md mt-2">
                      📅 Booked At: {formattedDateTime}
                    </p>
                  </div>
                </div>

                {/* CANCEL TRIP BUTTON */}
                <div className="w-full sm:w-auto flex justify-end">
                  <button
                    onClick={() => openCancelModal(booking._id)}
                    className="w-full sm:w-auto bg-red-600 hover:bg-gray-600 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition shadow-md active:scale-95"
                  >
                    Cancel Trip
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom English Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-amber-100 rounded-2xl shadow-2xl p-6 w-full max-w-sm transform scale-100 transition-all">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-wide text-center">
              Cancel This Trip?
            </h3>
            <p className="text-sm text-gray-500 text-center mt-2">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wide transition"
              >
                No, Keep it
              </button>
              <button
                onClick={handleConfirmCancel}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wide transition shadow-md shadow-red-200"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}