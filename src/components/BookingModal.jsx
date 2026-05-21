"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function BookingModal({ car }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [driverNeeded, setDriverNeeded] = useState("No");
  const [specialNote, setSpecialNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // এখানে /api কেটে শুধু ক্লিন পাথ (/bookings) করা হলো
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // কুকি টোকেন পাঠানোর জন্য 
        body: JSON.stringify({
          carId: car._id,
          driverNeeded,
          specialNote,
        }),
      });

      if (res.ok) {
        toast.success("Car booked successfully!");
        setOpen(false);
        setSpecialNote("");
        router.push("/my-bookings"); 
      } else if (res.status === 401) {
        toast.error("Please login first to book a car");
        router.push("/login");
      } else {
        const err = await res.json();
        toast.error(err.message || "Booking failed");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={car.availabilityStatus !== "Available"}
        className="mt-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2.5 rounded-full transition w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {car.availabilityStatus === "Available" ? "Book Now ↗️" : "Not Available"}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-amber-50 rounded-2xl shadow-xl p-6 w-full max-w-md border border-amber-200">
            <h3 className="text-xl font-bold text-red-800 mb-4 uppercase">Confirm Booking</h3>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">{car.carName}</span> — BDT.{car.dailyRentPrice?.toLocaleString()}/day
            </p>

            <form onSubmit={handleBooking}>
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">
                  Driver Needed?
                </label>
                <select
                  value={driverNeeded}
                  onChange={(e) => setDriverNeeded(e.target.value)}
                  className="w-full border border-amber-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">
                  Special Note
                </label>
                <textarea
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  placeholder="Any special requests..."
                  rows={3}
                  className="w-full border border-amber-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 border border-amber-400 text-amber-700 font-semibold py-2 rounded-full text-sm hover:bg-amber-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-full text-sm transition disabled:opacity-60"
                >
                  {loading ? "Booking..." : "Book Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}