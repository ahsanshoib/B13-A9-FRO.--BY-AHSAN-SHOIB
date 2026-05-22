"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import BookingModal from "@/components/BookingModal";
import Spinner from "@/components/Spinner"; 
import { FaMapMarkerAlt, FaUsers, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";

export default function CarDetailsPage() {
  const router = useRouter();
  const params = useParams(); 
  const id = params?.id;

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("You must login first to view car details!");
      router.push("/login");
      return;
    }


    const fetchCarDetails = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${id}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setCar(data);
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCarDetails();
    }
  }, [id, router]);

  
  if (loading) {
    return (
      <div className="text-center py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm font-medium">Checking authorization & loading...</p>
      </div>
    );
  }

  
  if (!car) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-800">Car not found</h2>
        <Link href="/" className="mt-4 inline-block text-amber-600 underline">
          Back to Home
        </Link>
      </div>
    );
  }


  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-red-800 text-center uppercase mb-8">
        Car Details
      </h1>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="md:w-1/2">
          <img
            src={car.imageUrl || "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"}
            alt={car.carName}
            className="w-full h-64 object-cover rounded-xl bg-gray-200"
          />
          <p className="text-center font-bold text-gray-800 mt-3 text-lg">{car.carName}</p>
        </div>

        {/* Details */}
        <div className="md:w-1/2 flex flex-col gap-3">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Car Type</p>
            <p className="text-gray-800 font-medium">{car.carType}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Car Name</p>
            <p className="text-gray-800 font-medium">{car.carName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Rent Price/Day</p>
            <p className="text-red-700 font-bold">BDT{car.dailyRentPrice?.toLocaleString()}</p>
          </div>
          <div className="flex gap-3">
            <span className="bg-amber-400 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <FaUsers /> {car.seatCapacity} Seats
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                car.availabilityStatus === "Available"
                  ? "bg-green-500 text-white"
                  : "bg-red-400 text-white"
              }`}
            >
              {car.availabilityStatus}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-amber-400 text-white text-xs font-semibold px-3 py-1 rounded-full w-fit">
            <FaMapMarkerAlt />
            <span>{car.pickupLocation}</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Rating</p>
            <div className="flex items-center gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((i) => (
                <FaStar key={i} />
              ))}
              <span className="text-gray-600 text-xs ml-1">
                4.9/5 | {car.booking_count || 0} bookings
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Description</p>
            <p className="text-sm text-gray-600 leading-relaxed">{car.description}</p>
          </div>

        
          <BookingModal car={car} />
        </div>
      </div>
    </div>
  );
}