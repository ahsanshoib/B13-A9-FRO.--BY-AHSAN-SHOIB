import Link from "next/link";

export default function CarCard({ car }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden shadow hover:shadow-md transition">
      <div className="h-40 overflow-hidden">
        <img
          src={car.imageUrl || "/fallback-car.png"} // যদি ইমেজ না থাকে তাহলে ফলব্যাক ইমেজ দেখাবে
          alt={car.carName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 text-center">
        <p className="font-bold text-gray-800 text-sm truncate">{car.carName}</p>
        <p className="text-xs text-gray-500 mt-0.5">{car.carType}</p>
        <p className="text-red-700 font-bold text-sm mt-1">
          {/* dailyRentPrice না থাকলেও যেন কোড ক্র্যাশ না করে সেফটি হ্যান্ডলিং */}
          BDT{car.dailyRentPrice ? car.dailyRentPrice.toLocaleString() : "0"}/day
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