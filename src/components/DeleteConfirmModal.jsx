"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DeleteConfirmModal({ car, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${car._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Car deleted successfully!");
        onSuccess();
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
        <h3 className="text-xl font-bold text-red-800 uppercase mb-3">Delete Car?</h3>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete <span className="font-semibold">{car?.carName}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 border border-amber-400 text-amber-700 font-semibold py-2 rounded-full text-sm hover:bg-amber-100 transition">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-full text-sm transition disabled:opacity-60">
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}