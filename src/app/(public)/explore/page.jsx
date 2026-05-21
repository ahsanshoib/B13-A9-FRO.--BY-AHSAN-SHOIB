"use client";
import { useState, useEffect } from "react";
import CarCard from "@/components/CarCard";
import Spinner from "@/components/Spinner";

const CAR_TYPES = ["All", "SUV", "Luxury SUV", "Electric SUV", "Luxury Electric", "Luxury SUV / Off-road"];

export default function ExplorePage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (type !== "All") params.append("type", type);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cars?${params}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setCars(data);
    } catch {
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [type]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCars();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-red-800 text-center uppercase mb-8">
        Explore Cars
      </h1>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 justify-center">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search by car name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-amber-300 bg-amber-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 w-56"
          />
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm px-5 py-2 rounded-full font-medium transition"
          >
            Search
          </button>
        </form>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-amber-300 bg-amber-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          {CAR_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : cars.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No cars found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}