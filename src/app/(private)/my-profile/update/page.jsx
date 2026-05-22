"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  
  
  const { data: session, isPending } = authClient.useSession();
  
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
    if (session) {
      setName(session.user?.name || "");
      setImageUrl(session.user?.image || "");
      setPreview(session.user?.image || null);
    }
  }, [session, isPending, router]);

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreview(url);
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.updateUser({
        name,
        image: imageUrl || undefined,
      });

      if (error) {
        toast.error(error.message || "Update failed. Please try again.");
        setLoading(false);
        return;
      }

      toast.success("Profile updated successfully!");
    
  
      router.push("/my-profile");
      router.refresh();
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-amber-100 rounded-2xl shadow-md w-full max-w-md p-8 flex flex-col gap-6">

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center uppercase tracking-wide">
          Update Profile
        </h2>

        {/* Image Preview */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-amber-200 bg-amber-50 shadow-sm flex items-center justify-center">
            {preview ? (
              
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setPreview(null)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-amber-500">
                <span className="text-white text-4xl font-bold">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 font-medium">New Image Preview</p>
        </div>

        {/* Form Inputs */}
        <div className="flex flex-col gap-4">
          
          {/* Photo URL */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">
              Photo URL
            </label>
            <input
              type="url"
              placeholder="Paste new profile picture link"
              value={imageUrl}
              onChange={handleImageUrlChange}
              className="w-full border border-amber-300 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-amber-300 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-xl transition text-sm shadow-sm disabled:opacity-60 flex items-center justify-center"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>

            <button
              onClick={() => router.push("/my-profile")}
              className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold py-2.5 rounded-xl transition text-sm text-center"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}