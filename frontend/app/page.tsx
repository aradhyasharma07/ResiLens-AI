"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#F8F7F4] text-[#111110]">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#F8F7F4]/95 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

          <div
            onClick={() => router.push("/")}
            className="text-4xl luxury-font cursor-pointer"
          >
            ResiLens
            <span className="text-[#1C6B4A]">.AI</span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm text-gray-600">
            <button onClick={() => router.push("/")}>Home</button>
            <button onClick={() => router.push("/login")}>Analyze</button>
            <button onClick={() => router.push("/login")}>Dashboard</button>
            <button onClick={() => router.push("/login")}>Sign in</button>
          </div>

          <button
            onClick={() => router.push("/login")}
            className="px-8 py-3 rounded-full bg-black text-white font-medium"
          >
            Get started
          </button>

        </div>
      </nav>

      {/* HERO SECTION WITH GRID ONLY */}
      <section className="grid-background">
        <div className="content-layer max-w-7xl mx-auto px-8 pt-24 pb-28 text-center">

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#1C6B4A]/20 bg-[#1C6B4A]/5 text-[#1C6B4A] text-sm mb-10">
            ● Intelligent Resume Screening
          </div>

          <h1 className="text-[92px] leading-[0.95] hero-title mb-8">
            Hire the best,
            <br />
            <span className="italic text-[#1C6B4A]">
              effortlessly.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-xl text-gray-500 leading-relaxed mb-12">
            ResiLens AI analyzes resumes against your job requirements
            in seconds — scoring, ranking, and explaining every match
            with transparent, bias-aware AI.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-5 mb-20">

            <button
              onClick={() => router.push("/login")}
              className="px-10 py-5 rounded-full bg-[#1C6B4A] text-white text-lg shadow-xl"
            >
              Analyze a resume →
            </button>

            <button
              onClick={() => router.push("/login")}
              className="px-10 py-5 rounded-full border border-black/10 bg-white text-lg"
            >
              View dashboard
            </button>

          </div>

          <div className="flex flex-wrap justify-center gap-10 text-gray-500 text-sm">
            <span>✓ FastAPI backend</span>
            <span>✓ MongoDB</span>
            <span>✓ Gemini AI</span>
            <span>✓ spaCy NLP</span>
          </div>

        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-black/5 py-20 ">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-4 gap-10 text-center">

          <div>
            <h2 className="text-6xl hero-title">98%</h2>
            <p className="text-gray-500 mt-2">Parse accuracy</p>
          </div>

          <div>
            <h2 className="text-6xl hero-title">3s</h2>
            <p className="text-gray-500 mt-2">Average analysis time</p>
          </div>

          <div>
            <h2 className="text-6xl hero-title">40+</h2>
            <p className="text-gray-500 mt-2">Evaluated criteria</p>
          </div>

          <div>
            <h2 className="text-6xl hero-title">10k+</h2>
            <p className="text-gray-500 mt-2">Resumes processed</p>
          </div>

        </div>
      </section>

      {/* CAPABILITIES */}
<section className="max-w-7xl mx-auto px-8 py-28">

  <p className="text-sm uppercase tracking-[0.2em] text-[#1C6B4A] mb-5">
    Capabilities
  </p>

  <div className="grid md:grid-cols-2 gap-10 mb-14">
    <h2 className="text-7xl hero-title leading-tight">
      Everything you need
      <br />
      to screen at scale
    </h2>

    <p className="text-xl text-gray-500 leading-relaxed self-center">
      From raw PDF to ranked shortlist —
      completely automated, fully explainable.
    </p>
  </div>

  <div className="grid md:grid-cols-3 gap-6">

    {[
      "📄 Smart parsing",
      "🎯 JD matching",
      "🤖 Gemini AI feedback",
      "📊 Multi-dimension scoring",
      "⚡ Instant ranking",
      "🛡️ Bias-aware design",
    ].map((item, index) => (
      <div
        key={index}
        className="group rounded-[28px] border border-black/5 bg-white p-10 min-h-[260px] cursor-pointer transition duration-500 ease-in-out hover:bg-[#176B47] hover:scale-[1.02] hover:shadow-2xl"
      >

        <h3 className="text-3xl hero-title mb-5 text-black transition duration-500 group-hover:text-white">
          {item}
        </h3>

        <p className="text-gray-500 leading-relaxed transition duration-500 group-hover:text-white/90">
          Professional recruiter-grade AI evaluation for
          accurate candidate selection and faster hiring.
        </p>

      </div>
    ))}

  </div>

</section>

      {/* PROCESS */}
      <section className="bg-black text-white py-28">
        <div className="max-w-7xl mx-auto px-8">

          <p className="text-sm uppercase tracking-[0.2em] text-[#1C6B4A] mb-5">
            Process
          </p>

          <h2 className="text-7xl hero-title mb-20">
            From upload to insight
            <br />
            in four steps
          </h2>

          <div className="grid md:grid-cols-4 gap-10">

            {[
              "Upload resume",
              "Add job description",
              "AI analysis",
              "Review & decide",
            ].map((step, index) => (
              <div key={index}>

                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-6">
                  0{index + 1}
                </div>

                <h3 className="text-2xl hero-title mb-4">{step}</h3>

                <p className="text-gray-400">
                  Professional workflow designed for modern recruiters.
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>



            {/* INSIGHT SECTION */}
      <section className="bg-[#F8F7F4] py-28">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}
          <div>

            <div className="text-[80px] text-[#E8F4EE] leading-none mb-6">
              ”
            </div>

            <h2 className="text-6xl hero-title italic leading-tight mb-10">
              The right hire changes everything.
              <br />
              The wrong one costs three times
              the salary.
            </h2>

            <div className="flex items-center gap-4 text-gray-500">
              <div className="w-10 h-[1px] bg-gray-300"></div>
              <p>
                ResiLens AI — making every screen count
              </p>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="bg-[#176B47] rounded-[36px] p-14 min-h-[500px] flex flex-col justify-end text-white">

            <h3 className="text-7xl hero-title mb-4">
              82%
            </h3>

            <p className="text-lg text-white/80 mb-10">
              Average match score accuracy vs. hiring outcome
            </p>

            <div className="flex items-end gap-4 h-32">
              {[30, 45, 60, 75, 55, 80, 65, 90].map(
                (height, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-white/10 rounded-md"
                    style={{ height: `${height}%` }}
                  />
                )
              )}
            </div>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-32 text-center">
        <div className="max-w-4xl mx-auto px-8">

          <h2 className="text-7xl hero-title mb-8">
            Ready to screen smarter?
          </h2>

          <p className="text-xl text-gray-500 mb-12">
            Upload your first resume free.
            No credit card, no setup required.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-5">

            <button
              onClick={() => router.push("/login")}
              className="px-10 py-5 rounded-full bg-black text-white text-lg"
            >
              Start analyzing →
            </button>

            <button
              onClick={() => router.push("/login")}
              className="px-10 py-5 rounded-full border border-black/10 bg-white text-lg"
            >
              Create free account
            </button>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/5 py-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">

          <div className="text-3xl luxury-font">
            ResiLens
            <span className="text-[#1C6B4A]">.AI</span>
          </div>

          <div className="flex gap-8 text-sm text-gray-500">
            <span>About</span>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>

          <div className="text-sm text-gray-500">
            © 2026 ResiLens AI
          </div>

        </div>
      </footer>

    </main>
  );
}