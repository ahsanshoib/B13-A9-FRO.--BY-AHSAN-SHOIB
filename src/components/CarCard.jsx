import Link from "next/link";

export default function CarCard({ car }) {
  const carImage = car.imageUrl || car.imgUrl || car.image || "/fallback-car.png";
  const carName = car.carName || car.name || "Unknown Car";
  const carType = car.carType || car.type || car.category || "Classic";
  const rentPrice = car.dailyRentPrice || car.rentPrice || car.price;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden shadow hover:shadow-md transition">
      <div className="h-40 overflow-hidden bg-gray-100">
        <img
          src={carImage} 
          alt={carName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/fallback-car.png";
          }}
        />
      </div>
      
      <div className="p-3 text-center">
        <p className="font-bold text-gray-800 text-sm truncate">{carName}</p>
        <p className="text-xs text-gray-500 mt-0.5">{carType}</p>
        <p className="text-red-700 font-bold text-sm mt-1">
          BDT {rentPrice ? rentPrice.toLocaleString() : "0"}/day
        </p>
        <Link
          href={`/cars/${car._id}`}
          className="inline-block mt-2 text-xs bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-full transition font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}