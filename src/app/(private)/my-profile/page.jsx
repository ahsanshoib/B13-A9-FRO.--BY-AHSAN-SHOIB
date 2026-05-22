"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client"; 

export default function MyProfilePage() {
  const router = useRouter();
  
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-16">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">

        {/* Profile Overview Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-800">Profile Overview</h2>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-amber-200 bg-amber-50 flex items-center justify-center">
                {user.image && !user.image.includes("default") ? (
                  <img
                    src={user.image}
                    alt="Profile Picture"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full flex items-center justify-center bg-amber-500"
                  style={{ display: user.image && !user.image.includes("default") ? "none" : "flex" }}
                >
                  <span className="text-white text-4xl font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Current Profile Picture
              </p>
            </div>

            {/* User Info */}
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-sm text-gray-500 font-medium">Current Name</p>
              <h3 className="text-2xl font-bold text-gray-800">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>

              <Link href="/my-profile/update" className="mt-3 w-fit">
                <button className="bg-amber-500 text-white hover:bg-amber-600 transition font-semibold px-6 py-2 rounded-xl text-sm shadow-sm">
                  Update Information
                </button>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}