"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddCarPage() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [carName, setCarName] = useState("");
  const [carType, setCarType] = useState("");
  const [dailyRentPrice, setDailyRentPrice] = useState("");
  const [seatCapacity, setSeatCapacity] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const [availabilityStatus, setAvailabilityStatus] =
    useState("Available");

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    const carData = {
      carName,
      carType,
      dailyRentPrice,
      seatCapacity,
      pickupLocation,
      imageUrl,
      description,
      availabilityStatus,
    };

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cars`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify(carData),
        }
      );

      const data = await res.json();

      if (res.ok) {

        toast.success(
          "Car added successfully to Explore Page!"
        );

        router.push("/explore");
        router.refresh();

      } else {

        toast.error(
          data.message || "Failed to add car"
        );
      }

    } catch (error) {

      console.error("Error adding car:", error);

      toast.error(
        "Something went wrong. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="bg-amber-200 w-full">

      <div className="bg-white py-12 px-4 flex items-center justify-center">

        <div className="bg-white border border-amber-200 rounded-3xl shadow-xl p-8 w-full max-w-2xl">

          <h1 className="text-2xl font-black text-red-800 uppercase tracking-wide text-center mb-6">
            Add a New Car
          </h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >

            {/* Car Name */}
            <div className="md:col-span-2">

              <label className="text-xs font-bold text-gray-800 uppercase block mb-1">
                Car Name
              </label>

              <input
                type="text"
                placeholder="MITSHUBISHI"
                value={carName}
                onChange={(e) =>
                  setCarName(e.target.value)
                }
                required
                className="w-full border border-amber-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800"
              />

            </div>

            {/* Car Type */}
            <div>

              <label className="text-xs font-bold text-gray-600 uppercase block mb-1">
                Car Type
              </label>

              <input
                type="text"
                placeholder="SUV"
                value={carType}
                onChange={(e) =>
                  setCarType(e.target.value)
                }
                required
                className="w-full border border-amber-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800"
              />

            </div>

            {/* Pickup Location */}
            <div>

              <label className="text-xs font-bold text-gray-600 uppercase block mb-1">
                Pickup Location
              </label>

              <input
                type="text"
                placeholder="NOWAKHALI"
                value={pickupLocation}
                onChange={(e) =>
                  setPickupLocation(e.target.value)
                }
                required
                className="w-full border border-amber-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800"
              />

            </div>

            {/* Rent Price */}
            <div>

              <label className="text-xs font-bold text-gray-600 uppercase block mb-1">
                Rent Price / Day (BDT)
              </label>

              <input
                type="number"
                placeholder="5000"
                value={dailyRentPrice}
                onChange={(e) =>
                  setDailyRentPrice(e.target.value)
                }
                required
                className="w-full border border-amber-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800"
              />

            </div>

          
            <div>

              <label className="text-xs font-bold text-gray-600 uppercase block mb-1">
                Seat Capacity
              </label>

              <input
                type="number"
                placeholder="4"
                value={seatCapacity}
                onChange={(e) =>
                  setSeatCapacity(e.target.value)
                }
                required
                className="w-full border border-amber-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800"
              />

            </div>

            {/* Image URL */}
            <div className="md:col-span-2">

              <label className="text-xs font-bold text-gray-600 uppercase block mb-1">
                Image URL
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="url"
                placeholder="https://images.google.com.jpg"
                value={imageUrl}
                onChange={(e) =>
                  setImageUrl(e.target.value)
                }
                required
                className="w-full border border-amber-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800"
              />

            </div>

            {/* Status */}
            <div className="md:col-span-2">

              <label className="text-xs font-bold text-gray-600 uppercase block mb-1">
                Status
              </label>

              <select
                value={availabilityStatus}
                onChange={(e) =>
                  setAvailabilityStatus(e.target.value)
                }
                className="w-full border border-amber-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800 appearance-none"
              >

                <option value="Available">
                  Available
                </option>

                <option value="Unavailable">
                  Unavailable
                </option>

              </select>

            </div>

            {/* Description */}
            <div className="md:col-span-2">

              <label className="text-xs font-bold text-gray-600 uppercase block mb-1">
                Description
              </label>

              <textarea
                rows="3"
                placeholder="Write something about the car conditions..."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                required
                className="w-full border border-amber-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800 resize-none"
              ></textarea>

            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 mt-2">

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-3 rounded-xl transition text-sm uppercase tracking-wider disabled:opacity-60"
              >

                {loading
                  ? "Adding Car..."
                  : "ADD CAR"}

              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}