import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ background: "#FDE9C9" }}
    >
      <h1 className="text-8xl font-extrabold text-red-800">404</h1>
      <p className="text-xl font-bold text-gray-700 mt-4">Oops! Page Not Found</p>
      <p className="text-sm text-gray-500 mt-2 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-7 py-2.5 rounded-full transition"
      >
        Back to Home
      </Link>
    </div>
  );
}