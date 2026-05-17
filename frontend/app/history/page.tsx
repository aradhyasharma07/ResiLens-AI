"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/history");
      const data = await response.json();

      setHistory(data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch history");
    }

    setLoading(false);
  };

  const handleOpenResult = (item: any) => {
    localStorage.setItem(
      "latestResult",
      JSON.stringify(item)
    );

    router.push("/results");
  };

  const handleOpenResume = (resumePath: string) => {
    if (!resumePath) {
      alert("Resume file not found");
      return;
    }

    const encodedPath = encodeURIComponent(resumePath);

    window.open(
      `http://127.0.0.1:8000/open-resume?path=${encodedPath}`,
      "_blank"
    );
  };

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

            <button onClick={() => router.push("/profile")}>
              Profile
            </button>
          </div>

        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-8 py-10">

        <p className="text-sm uppercase tracking-[0.2em] text-[#1C6B4A] mb-4">
          Candidate History
        </p>

        <h1 className="text-6xl hero-title mb-4">
          Analysis History
        </h1>

        <p className="text-lg text-gray-500 mb-12">
          View all previously analyzed resumes and recruiter decisions.
        </p>

        {loading ? (
          <p className="text-gray-500">
            Loading history...
          </p>
        ) : history.length === 0 ? (
          <p className="text-gray-500">
            No analysis history found.
          </p>
        ) : (
          <div className="space-y-6">

            {history.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-[32px] border border-black/5 p-8 shadow-sm"
              >

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                  {/* LEFT */}
                  <div className="space-y-4">

                    <p className="text-2xl hero-title">
                      {item.fileName || "Resume.pdf"}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">

                      <p>
                        <strong>Time:</strong> {item.time}
                      </p>

                      <p>
                        <strong>Mode:</strong> {item.analysisMode || "Standard"}
                      </p>

                    </div>

                    <div className="flex flex-wrap gap-4">

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          item.result === "Shortlisted"
                            ? "bg-[#EAF7F0] text-[#176B47]"
                            : "bg-[#FFF1F1] text-red-500"
                        }`}
                      >
                        {item.result}
                      </span>

                      <span className="px-4 py-2 rounded-full bg-[#F5F3EE] text-sm">
                        {item.matchedSkills?.length || 0} Skills Matched
                      </span>

                    </div>

                  </div>

                  {/* RIGHT */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

                    <div>
                      <p className="text-3xl hero-title">
                        {item.confidence || 50}%
                      </p>
                      <p className="text-sm text-gray-500">
                        Overall Match
                      </p>
                    </div>

                    <div>
                      <p className="text-3xl hero-title">
                        {item.skillsMatch || 50}%
                      </p>
                      <p className="text-sm text-gray-500">
                        Skills Match
                      </p>
                    </div>

                    <div>
                      <p className="text-3xl hero-title">
                        {item.experienceFit || 50}%
                      </p>
                      <p className="text-sm text-gray-500">
                        Experience Fit
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenResume(item.resumePath)}
                      className="col-span-2 md:col-span-3 px-6 py-4 rounded-full border border-black/10 bg-white"
                    >
                      Open Resume PDF →
                    </button>

                    <button
                      onClick={() => handleOpenResult(item)}
                      className="col-span-2 md:col-span-3 mt-2 px-6 py-4 rounded-full bg-black text-white"
                    >
                      Open Full Result →
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>

    </main>
  );
}