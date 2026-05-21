"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const issueJWT = async (email, name) => {
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, name }),
    });
    return res;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login successful!");
        
        localStorage.setItem("user", JSON.stringify(data.user));
        
        router.push("/");
        router.refresh(); 
      } else {
        toast.error(data.message || "Invalid email or password");
      }
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await res.json();

        if (googleUser?.email) {
          const jwtRes = await issueJWT(googleUser.email, googleUser.name);
          
          if (jwtRes.ok) {
            toast.success("Google Login successful!");
            const userData = { email: googleUser.email, name: googleUser.name };
            localStorage.setItem("user", JSON.stringify(userData));
            
            router.push("/");
            router.refresh();
          } else {
            toast.error("Failed to sync session with server");
          }
        } else {
          toast.error("Failed to get user information from Google");
        }
      } catch (err) {
        toast.error("Google login failed during token generation");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error("Google login failed");
    },
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/hero-banner.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-amber-900/30" />

      <div className="relative z-10 bg-amber-50 border border-amber-200 rounded-2xl shadow-xl p-7 w-full max-w-sm">
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
          onClick={() => handleGoogleLogin()}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg transition text-sm mt-3 disabled:opacity-60"
        >
          <FcGoogle size={18} /> Google Login
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