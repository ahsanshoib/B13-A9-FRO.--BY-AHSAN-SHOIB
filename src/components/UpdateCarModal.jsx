"use client";
import { useState } from "react";
import toast from "react-hot-toast";

const CAR_TYPES = ["SUV", "Sedan", "Hatchback", "Luxury SUV", "Electric SUV", "Luxury Electric", "Luxury SUV / Off-road"];

export default function UpdateCarModal({ car, onClose, onSuccess }) {
  const [form, setForm] = useState({
    dailyRentPrice: car.dailyRentPrice,
    description: car.description,
    availabilityStatus: car.availabilityStatus,
    imageUrl: car.imageUrl,
    carType: car.carType,
    pickupLocation: car.pickupLocation,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    setLoading(true);
    try {
    
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${car._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, dailyRentPrice: Number(form.dailyRentPrice) }),
      });
      if (res.ok) {
        toast.success("Car updated successfully!");
        onSuccess();
      } else {
        toast.error("Update failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-red-800 uppercase text-center mb-5">Update Car</h3>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Daily Rent Price</label>
              <input 
                name="dailyRentPrice" 
                type="number" 
                value={form.dailyRentPrice}
                onChange={handleChange} 
                className="w-full border border-amber-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" 
                placeholder="e.g., 250" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Daily Rent</label>
              
              <input 
                disabled 
                value={`${Number(form.dailyRentPrice).toLocaleString()} BDT`}
                className="w-full border border-amber-300 bg-amber-100 cursor-not-allowed rounded-lg px-3 py-2 text-sm font-semibold text-gray-700" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Car Type</label>
            <select name="carType" value={form.carType} onChange={handleChange} className="w-full border border-amber-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
              {CAR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Image URL</label>
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange}
              className="w-full border border-amber-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" placeholder="e.g., https://example.com/car-image.jpg" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Pickup Location</label>
            <input name="pickupLocation" value={form.pickupLocation} onChange={handleChange}
              className="w-full border border-amber-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" placeholder="e.g., Downtown Miami" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={3} className="w-full border border-amber-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              placeholder="A meticulously restored iconic classic with a new engine..." />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Availability</label>
            <select name="availabilityStatus" value={form.availabilityStatus}
              onChange={handleChange} className="w-full border border-amber-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          <div className="flex gap-3 mt-2">
            <button onClick={onClose}
              className="flex-1 border border-amber-400 text-amber-700 font-semibold py-2 rounded-full text-sm hover:bg-amber-100 transition">
              Cancel
            </button>
            <button onClick={handleUpdate} disabled={loading}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-full text-sm transition disabled:opacity-60">
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}