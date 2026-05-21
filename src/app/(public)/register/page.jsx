"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

function validatePassword(password) {
  if (password.length < 6) return "Password must be at least 6 characters.";
  if (!/[A-Z]/.test(password)) return "Password must have at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must have at least one lowercase letter.";
  return null;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", photoURL: "", password: "" });
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "password") setPasswordError("");
  };

  // কাস্টম ফর্ম সাবমিট রেজিস্ট্রেশন হ্যান্ডলার
  const handleRegister = async (e) => {
    e.preventDefault();
    const err = validatePassword(form.password);
    if (err) { setPasswordError(err); return; }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          image: form.photoURL 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account created successfully! Please login.");
        router.push("/login");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch {
      toast.error("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };


  const issueJWT = async (email, name) => {
    // এখানে এক্সট্রা /api কেটে ক্লিন পাথ করা হলো
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, name }),
    });
    return res;
  };

  // গুগল ওঅথ রেজিস্ট্রেশন হ্যান্ডলার
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        // এখানে Bearer স্ট্রিং লিটারেল ব্যাকটিক দিয়ে ফিক্স করা হলো
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await res.json();

        if (googleUser?.email) {
          const jwtRes = await issueJWT(googleUser.email, googleUser.name);
          
          if (jwtRes.ok) {
            toast.success("Google Registration & Login successful!");
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
      toast.error("Google registration failed");
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
          Register
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          {[
            { label: "Name", name: "name", type: "text", placeholder: "Your full name" },
            { label: "Email", name: "email", type: "email", placeholder: "Email" },
            { label: "Photo URL", name: "photoURL", type: "url", placeholder: "https://..." },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                required={field.name !== "photoURL"}
                className="w-full border border-amber-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          ))}

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                passwordError ? "border-red-400" : "border-amber-300"
              } bg-white`}
            />
            {passwordError && (
              <p className="text-red-600 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-800 hover:bg-red-900 text-white font-semibold py-2 rounded-lg transition text-sm mt-1 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
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
          Already have an account?{" "}
          <Link href="/login" className="text-red-700 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}