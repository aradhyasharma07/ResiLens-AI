"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
  const router = useRouter();

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("latestResult");

    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">
        <p className="text-gray-500 text-lg">
          Loading results...
        </p>
      </main>
    );
  }

  const isShortlisted =
    data.result === "Shortlisted";

  return (
    <main className="min-h-screen bg-[#F8F7F4] text-[#111110] pt-28">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F8F7F4]/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-10 py-6 flex items-center justify-between">

          <div
            onClick={() => router.push("/")}
            className="text-3xl cursor-pointer luxury-font"
          >
            ResiLens
            <span className="text-[#1C6B4A]">.AI</span>
          </div>

          <div className="flex items-center gap-8 text-sm text-gray-600">

            <button onClick={() => router.push("/")}>
              Home
            </button>

            <button onClick={() => router.push("/dashboard")}>
              Analyze
            </button>

            <button onClick={() => router.push("/history")}>
              History
            </button>

            <button onClick={() => router.push("/profile")}>
              Profile
            </button>

          </div>

        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-8 py-10">

        <button
          onClick={() => router.push("/dashboard")}
          className="mb-8 px-6 py-3 rounded-full border border-black/10 bg-white hover:bg-black hover:text-white transition-all duration-300"
        >
          ← Back to Dashboard
        </button>

        {/* HEADER */}
        <div className="mb-12">

          <p className="text-sm uppercase tracking-[0.2em] text-[#1C6B4A] mb-4">
            Analysis Complete
          </p>

          <h1 className="text-6xl hero-title mb-4">
            Candidate Evaluation
          </h1>

          <p className="text-lg text-gray-500">
            Full recruiter review and resume inspection
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">

            {/* MAIN RESULT CARD */}
            <div className="bg-black text-white rounded-[32px] p-10">

              <p
                className={`text-sm mb-3 ${
                  isShortlisted
                    ? "text-[#2D9E6E]"
                    : "text-red-400"
                }`}
              >
                {isShortlisted
                  ? "Strong Match"
                  : "Needs Improvement"}
              </p>

              <h2 className="text-5xl hero-title mb-4">
                {isShortlisted
                  ? "Highly Recommended"
                  : "Not Recommended"}
              </h2>

              <p className="text-gray-300 max-w-2xl mb-10 leading-relaxed">
                {isShortlisted
                  ? "This candidate demonstrates strong alignment with the role and shows excellent technical capability for the given job description."
                  : "This candidate does not sufficiently match the required job description and needs stronger technical alignment for this role."}
              </p>

              <div className="grid md:grid-cols-3 gap-8">

                <div>
                  <h3 className="text-5xl hero-title">
                    {data.confidence ?? 0}%
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Overall Match
                  </p>
                </div>

                <div>
                  <h3 className="text-5xl hero-title">
                    {data.skillsMatch ?? 0}%
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Skills Match
                  </p>
                </div>

                <div>
                  <h3 className="text-5xl hero-title">
                    {data.experienceFit ?? 0}%
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Experience Fit
                  </p>
                </div>

              </div>

            </div>

            {/* RESUME PREVIEW */}
            <div className="bg-white rounded-[32px] border border-black/5 p-8">

              <h2 className="text-3xl hero-title mb-6">
                Full Resume Preview
              </h2>

              <div className="bg-[#FAFAF7] rounded-[24px] p-8 max-h-[650px] overflow-y-auto whitespace-pre-wrap text-gray-700 leading-relaxed border border-black/5">

                {data.preview &&
                data.preview.trim() !== ""
                  ? data.preview
                  : "Resume preview could not be generated."}

              </div>

            </div>

            {/* AI FEEDBACK */}
            <div className="bg-white rounded-[32px] border border-black/5 p-8">

              <h2 className="text-3xl hero-title mb-6">
                AI Recruiter Feedback
              </h2>

              <div className="bg-[#FAFAF7] rounded-[24px] p-8 whitespace-pre-wrap text-gray-700 leading-relaxed border border-black/5">

                {data.feedback &&
                data.feedback.trim() !== ""
                  ? data.feedback
                  : "AI recruiter feedback unavailable."}

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-8">

            {/* RESULT CARD */}
            <div className="bg-white rounded-[32px] border border-black/5 p-8">

              <h2 className="text-3xl hero-title mb-6">
                Screening Result
              </h2>

              <p
                className={`text-xl font-medium mb-4 ${
                  isShortlisted
                    ? "text-[#1C6B4A]"
                    : "text-red-500"
                }`}
              >
                {data.result || "Unknown"}
              </p>

              <div className="space-y-3 text-gray-500">

                <p>
                  <strong>File:</strong>{" "}
                  {data.fileName || "Unknown Resume"}
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {data.time || "N/A"}
                </p>

              </div>

            </div>

            {/* ACTIONS */}
            <div className="bg-white rounded-[32px] border border-black/5 p-8">

              <h2 className="text-3xl hero-title mb-6">
                Actions
              </h2>

              <div className="space-y-4">

                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full py-4 rounded-full bg-black text-white hover:scale-[1.02] transition-all duration-300"
                >
                  Analyze Another →
                </button>

                <button
                  onClick={() => router.push("/history")}
                  className="w-full py-4 rounded-full border border-black/10 bg-white hover:bg-black hover:text-white transition-all duration-300"
                >
                  View History
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}