import Link from "next/link";

async function getCars() {
  try {
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cars`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const reviews = [
  {
    name: "Hero Alam",
    role: "Best Hero and Singer",
    review:
      "Good service! The car was in pristine condition and the whole booking experience was seamless. Truly a ride back in time.",
    initials: "HA",
  },
  {
    name: "Khairul Dewan",
    role: "Upcoming PM",
    review:
      "Vinatge ride is the best! I rented a '67 Mustang for my anniversary and it was absolutely magical. The team was so professional.",
    initials: "KD",
  },
  {
    name: "Choton Kaka",
    role: "Winter Lover",
    review:
      "Exceptional attention to detail. Every vehicle felt like a rolling museum piece. Will definitely book again for our next event.",
    initials: "CK",
  },
];

const stats = [
  { value: "50+", label: "Cars" },
  { value: "700+", label: "Clients" },
  { value: "60+", label: "Drivers" },
];

export default async function HomePage() {
  const cars = await getCars();
  const featured = cars.slice(0, 6);

  return (
    <div className="bg-[#fdf8e1]">
      {/* ── Hero Banner ── */}
      <section
        className="relative min-h-[480px] flex items-center justify-center text-center"
        style={{
          backgroundImage: "url('/hero-banner.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-amber-900/30" />
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase leading-tight drop-shadow">
            Unplug From The Modern World
          </h1>
          <p className="text-2xl md:text-1xl font-medium text-white mt-3">
            Step away from the fast digital rush and rediscover timeless elegance through handcrafted details, chrome reflections, and the soulful presence of classic vintage cars that carry stories from another golden era.
          </p>
          <Link
            href="/explore"
            className="inline-block mt-8 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-full transition text-base shadow-md"
          >
            Explore Cars →
          </Link>
        </div>
      </section>

      
      <section className="bg-amber-200 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-amber-600 mb-2">
              What They Say
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-[#1a2e1a] uppercase"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Client Reviews
            </h2>
            <div className="mx-auto mt-4 w-16 h-[3px] bg-amber-500 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="relative bg-white border border-amber-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
              >
                <span
                  className="absolute top-4 right-5 text-5xl text-amber-200 font-serif leading-none select-none"
                  aria-hidden
                >
                  "
                </span>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#1a2e1a] flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-200 font-bold text-sm">
                      {r.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-[#1a2e1a] text-sm leading-tight">
                      {r.name}
                    </p>
                    <p className="text-xs text-amber-600/80 mt-0.5">{r.role}</p>
                  </div>
                </div>

                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg
                      key={s}
                      className="w-4 h-4 text-amber-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">{r.review}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span
                className="text-5xl md:text-6xl font-extrabold text-amber-400"
                style={{ fontFamily: "'Georgia', serif", letterSpacing: "-1px" }}
              >
                {stat.value}
              </span>
              <span className="mt-2 text-sm md:text-base font-semibold tracking-[0.25em] uppercase text-amber-400/70">
                {stat.label}
              </span>
              <div className="mt-3 w-10 h-[2px] bg-amber-500/60 rounded-full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}