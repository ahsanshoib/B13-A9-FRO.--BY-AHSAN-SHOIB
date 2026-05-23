"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import toast from "react-hot-toast";

const RE_USABLE_FALLBACK =
  "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg";

export default function MyBookingsPage() {
  const router = useRouter();

  const [bookedCars, setBookedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);

    try {
      const bookingRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
        {
          credentials: "include",
        }
      );

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

  const openCancelModal = (bookingId) => {
    setActiveBookingId(bookingId);
    setIsModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!activeBookingId) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${activeBookingId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        toast.success("Trip canceled successfully!");

        setBookedCars(
          bookedCars.filter(
            (booking) => booking._id !== activeBookingId
          )
        );
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
    if (!url || url.trim() === "" || url === "HH")
      return RE_USABLE_FALLBACK;

    if (url.startsWith("data:"))
      return url;

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    )
      return url;

    return url.startsWith("/") ? url : `/${url}`;
  };

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">

        <h1 className="text-3xl font-extrabold text-red-800 text-center uppercase mb-8">
          My Bookings
        </h1>

        {loading ? (
          <Spinner />
        ) : bookedCars.length === 0 ? (

          <div className="text-center bg-white border border-amber-200 rounded-3xl p-12 shadow-sm">
            <p className="text-gray-500 mb-5 text-lg">
              No booked cars found.
            </p>

            <button
              onClick={() => router.push("/explore")}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-7 py-3 rounded-full transition text-sm shadow-md"
            >
              Explore Cars to Book
            </button>
          </div>

        ) : (

          <div className="flex flex-col gap-5">

            {bookedCars.map((booking, index) => {

              const carName =
                booking.carName ||
                booking.carId?.carName ||
                booking.carId?.name ||
                "Unknown Car";

              const imageUrl =
                booking.imageUrl ||
                booking.carId?.imageUrl ||
                booking.carId?.imgUrl ||
                booking.carId?.image ||
                booking.imgUrl ||
                booking.image;

              const description =
                booking.description ||
                booking.carId?.description ||
                "No description available.";

              const rentPrice =
                booking.dailyRentPrice ||
                booking.carId?.dailyRentPrice ||
                booking.carId?.rentPrice ||
                booking.carId?.price;

              const formattedDateTime = booking.bookingDate
                ? new Date(
                    booking.bookingDate
                  ).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })
                : "Not Available";

              return (
                <div
                  key={booking._id || index}
                  className="bg-white border border-amber-200 rounded-3xl shadow-sm p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                >

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">

                    <img
                      src={getValidImageUrl(imageUrl)}
                      alt={carName}
                      className="w-32 h-24 object-cover rounded-2xl flex-shrink-0 bg-gray-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = RE_USABLE_FALLBACK;
                      }}
                    />

                    <div className="flex-1">

                      <div className="flex items-center gap-2 flex-wrap">

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-blue-100 text-blue-700">
                          Booked
                        </span>

                        {rentPrice && (
                          <span className="text-xs font-bold text-red-700">
                            BDT {rentPrice.toLocaleString()}/day
                          </span>
                        )}

                      </div>

                      <p className="font-bold text-gray-800 mt-1 text-lg">
                        {carName}
                      </p>

                      <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                        {description}
                      </p>

                      <p className="text-[11px] font-medium text-amber-950 bg-amber-200/60 inline-block px-3 py-1 rounded-md mt-3">
                        Booked At: {formattedDateTime}
                      </p>

                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex justify-end">

                    <button
                      onClick={() =>
                        openCancelModal(booking._id)
                      }
                      className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition shadow-md active:scale-95"
                    >
                      Cancel Trip
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">

            <div className="bg-white border border-amber-200 rounded-3xl shadow-2xl p-6 w-full max-w-sm transform scale-100 transition-all">

              <h3 className="text-lg font-black text-gray-900 uppercase tracking-wide text-center">
                Cancel This Trip?
              </h3>

              <p className="text-sm text-gray-500 text-center mt-2">
                Are you sure you want to cancel this booking?
                This action cannot be undone.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-6">

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wide transition"
                >
                  No, Keep it!
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
    </div>
  );
}