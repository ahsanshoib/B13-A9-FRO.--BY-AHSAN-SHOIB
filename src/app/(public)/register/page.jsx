"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoUrl, setPhotoUrl] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authClient.signUp.email({
        email,
        password,
        name,
        image: photoUrl || undefined, 
        callbackURL: "/login",
      }, {
        onSuccess: () => {
          toast.success("Account created successfully!");
          router.push("/");
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Registration failed. Try again.");
        }
      });
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: '/',
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (!isMounted) {
    return <div className="fixed inset-0 bg-amber-50" />;
  }

  return (
    <div
      className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center px-4 overflow-y-auto py-6"
      style={{
        backgroundImage: "url('/hero-banner.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      
      <div className="absolute inset-0 bg-amber-900/40" />

      
      <div className="relative z-10 bg-amber-50 border border-amber-200 rounded-2xl shadow-xl p-7 w-full max-w-sm my-auto">
        <h2 className="text-xl font-extrabold text-red-800 uppercase text-center mb-5">
          Register
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-amber-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-amber-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-amber-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Photo URL (Optional)</label>
            <input
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full border border-amber-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-800 hover:bg-red-900 text-white font-semibold py-2 rounded-lg transition text-sm mt-1 disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg transition text-sm mt-3 disabled:opacity-60"
        >
          <FcGoogle size={18} /> {loading ? "Connecting..." : "Google Login"}
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-red-700 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}