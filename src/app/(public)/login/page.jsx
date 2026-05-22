"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await authClient.signIn.email({
        email,
        password,
        callbackURL: "/", 
      }, {
        onSuccess: () => {
          toast.success("Login successful!");
          router.push("/");
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Invalid email or password");
        }
      });
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3000/",
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
      className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center px-4 overflow-y-auto"
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
          Login
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-800 hover:bg-red-900 text-white font-semibold py-2 rounded-lg transition text-sm mt-1 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
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
          New?{" "}
          <Link href="/register" className="text-red-700 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}