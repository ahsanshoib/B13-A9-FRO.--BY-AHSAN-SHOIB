import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivateLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#ffff" }}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}