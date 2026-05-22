"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import UpdateCarModal from "@/components/UpdateCarModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import toast from "react-hot-toast";

const RE_USABLE_FALLBACK = "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg";

export default function MyCarsPage() {
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCar, setEditCar] = useState(null);
  const [deleteCar, setDeleteCar] = useState(null);

  const fetchMyCars = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/my`, {
        credentials: "include",
      });

      if (res.status === 401) {
        toast.error("Please login to view your added cars");
        router.push("/login");
        return;
      }

      const data = await res.json();
      setCars(Array.isArray(data) ? data : []);
    } catch {
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchMyCars(); 
  }, []);

  const getValidImageUrl = (url) => {
    if (!url || url.trim() === "" || url === "HH") {
      return RE_USABLE_FALLBACK;
    }
    

    if (url.startsWith("data:")) {
      return url;
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    
    return url.startsWith("/") ? url : `/${url}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-red-700 text-center uppercase mb-8">
        My Added Cars
      </h1>

      {loading ? <Spinner /> : cars.length === 0 ? (
        <div className="text-center bg-white border border-amber-200 rounded-xl p-10">
          <p className="text-gray-500 mb-4">You haven't added any cars yet.</p>
          <button
            onClick={() => router.push("/add-car")}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-full transition text-sm"
          >
            Add a New Car
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {cars.map((car) => (
            <div
              key={car._id}
              className="bg-white border border-amber-200 rounded-2xl shadow p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
            >
              <img
                src={getValidImageUrl(car.imageUrl || car.imgUrl || car.image)}
                alt={car.carName || car.name || "Vintage Car"}
                className="w-28 h-20 object-cover rounded-xl flex-shrink-0 bg-gray-200"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = RE_USABLE_FALLBACK;
                }}
              />
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-500 uppercase">Car Name</p>
                <p className="font-bold text-gray-800">{car.carName || car.name || "Unknown Car"}</p>
                <p className="text-xs font-bold text-gray-500 uppercase mt-1">Car Description</p>
                <p className="text-xs text-gray-600 line-clamp-2">{car.description || "No description provided."}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditCar(car)}
                  className="bg-amber-400 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteCar(car)}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editCar && (
        <UpdateCarModal
          car={editCar}
          onClose={() => setEditCar(null)}
          onSuccess={() => { setEditCar(null); fetchMyCars(); }}
        />
      )}
      {deleteCar && (
        <DeleteConfirmModal
          car={deleteCar}
          onClose={() => setDeleteCar(null)}
          onSuccess={() => { setDeleteCar(null); fetchMyCars(); }}
        />
      )}
    </div>
  );
}