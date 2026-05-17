"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [selectedMode, setSelectedMode] =
    useState("standard");

  const [jobDescription, setJobDescription] =
    useState("");

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (loading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            return prev;
          }

          return prev + 10;
        });
      }, 400);
    }

    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async () => {
    if (!file) {
      alert(
        "Please upload a resume first"
      );

      return;
    }

    if (!jobDescription.trim()) {
      alert(
        "Please paste the job description"
      );

      return;
    }

    setLoading(true);

    setProgress(10);

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
      "job_description",
      jobDescription
    );

    formData.append(
      "analysis_mode",
      selectedMode
    );

    try {
      const response = await fetch(
        "https://resilens-ai-backend.onrender.com/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.detail ||
            "Analysis failed"
        );

        setLoading(false);

        setProgress(0);

        return;
      }

      setProgress(100);

      localStorage.setItem(
        "latestResult",
        JSON.stringify(data)
      );

      setTimeout(() => {
        router.push("/results");
      }, 500);

    } catch (error) {
      console.error(error);

      alert(
        "Backend not running or failed to connect"
      );

      setLoading(false);

      setProgress(0);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#111111]">

      {/* LOADING OVERLAY */}

      {loading && (

        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F7F5F0]/80 backdrop-blur-md">

          <div className="w-[420px] rounded-[32px] border border-black/10 bg-white p-10 shadow-2xl">

            <div className="mb-6 flex items-center gap-4">

              <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-[#176B47] text-2xl text-white">
                🤖
              </div>

              <div>

                <h2 className="hero-title text-[32px] leading-none">
                  Analyzing Resume
                </h2>

                <p className="mt-2 text-sm text-[#7A746B]">
                  AI is processing candidate profile...
                </p>

              </div>

            </div>

            <div className="mb-4 h-3 overflow-hidden rounded-full bg-[#ECE7DD]">

              <div
                className="h-full rounded-full bg-[#176B47] transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <div className="flex items-center justify-between text-sm text-[#7A746B]">

              <span>
                Processing
              </span>

              <span>
                {progress}%
              </span>

            </div>

            <div className="mt-8 space-y-3 text-sm text-[#8D877F]">

              <div className="flex items-center gap-3">

                <span className="text-[#176B47]">
                  ✓
                </span>

                Resume uploaded

              </div>

              <div className="flex items-center gap-3">

                <span className="animate-pulse text-[#176B47]">
                  ●
                </span>

                Extracting skills and experience

              </div>

              <div className="flex items-center gap-3">

                <span className="animate-pulse text-[#176B47]">
                  ●
                </span>

                Generating AI recruiter insights

              </div>

            </div>

          </div>

        </div>

      )}

      {/* NAVBAR */}

      <nav className="sticky top-0 z-50 w-full border-b border-black/5 bg-[#F7F5F0]/95 backdrop-blur-md">

        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-5">

          <div
            onClick={() =>
              router.push("/")
            }
            className="luxury-font cursor-pointer text-[38px]"
          >
            ResiLens
            <span className="text-[#176B47]">
              .AI
            </span>
          </div>

          <div className="hidden items-center gap-10 text-[14px] text-[#7A746B] md:flex">

            <button
              onClick={() =>
                router.push("/")
              }
              className="cursor-pointer transition hover:text-black"
            >
              Home
            </button>

            <button className="cursor-pointer transition hover:text-black">
              Analyze
            </button>

            <button
              onClick={() =>
                router.push(
                  "/history"
                )
              }
              className="cursor-pointer transition hover:text-black"
            >
              History
            </button>

            <button
              onClick={() =>
                router.push(
                  "/profile"
                )
              }
              className="cursor-pointer transition hover:text-black"
            >
              Profile
            </button>

          </div>

          <button
            onClick={() =>
              router.push("/profile")
            }
            className="cursor-pointer rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition hover:scale-[1.02]"
          >
            Profile
          </button>

        </div>

      </nav>

      <section className="mx-auto max-w-[900px] px-8 py-16">

        {/* STEPPER */}

        <div className="mb-16 flex items-center gap-4">

          <div className="flex items-center gap-3">

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#176B47] text-xs font-medium text-white">
              1
            </div>

            <span className="text-[15px] font-medium text-[#176B47]">
              Upload
            </span>

          </div>

          <div className="h-[1px] w-12 bg-[#D9D4CA]" />

          <div className="flex items-center gap-3">

            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D9D4CA] text-xs text-[#A9A39A]">
              2
            </div>

            <span className="text-[15px] text-[#A9A39A]">
              Configure
            </span>

          </div>

          <div className="h-[1px] w-12 bg-[#D9D4CA]" />

          <div className="flex items-center gap-3">

            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D9D4CA] text-xs text-[#A9A39A]">
              3
            </div>

            <span className="text-[15px] text-[#A9A39A]">
              Analyze
            </span>

          </div>

        </div>

        {/* TITLE */}

        <h1 className="hero-title mb-5 text-[64px] leading-none">
          Analyze a resume
        </h1>

        <p className="mb-14 text-[18px] leading-relaxed text-[#8D877F]">
          Upload a resume below.
          Add a job description
          for a targeted match
          score and skill gap
          analysis.
        </p>

        {/* DROP AREA */}

        <div className="group relative mb-14 overflow-hidden rounded-[36px] border border-dashed border-[#DDD7CD] bg-white/70 p-14 transition-all duration-300 hover:border-[#176B47]/40 hover:bg-white">

          <div className="flex flex-col items-center justify-center text-center">

            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#F4F1EA] shadow-sm transition-transform duration-300 group-hover:scale-105">

              <span className="text-4xl">
                📄
              </span>

            </div>

            <h2 className="hero-title text-[52px] leading-none text-[#111111]">
              Drop resume here
            </h2>

            <p className="mt-4 text-[18px] text-[#8D877F]">
              Upload PDF, DOCX,
              TXT or DOC files up
              to 10 MB
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">

              {[
                "PDF",
                "DOCX",
                "TXT",
                "DOC",
              ].map((type) => (

                <div
                  key={type}
                  className="rounded-2xl border border-[#DDD7CD] bg-[#FAF8F4] px-5 py-2 text-sm font-medium text-[#7A746B]"
                >
                  {type}
                </div>

              ))}

            </div>

            <div className="mt-10">

              {!file ? (

                <label className="cursor-pointer">

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={(e) =>
                      setFile(
                        e.target
                          .files
                          ? e.target
                              .files[0]
                          : null
                      )
                    }
                  />

                  <div className="inline-flex cursor-pointer items-center gap-3 rounded-2xl bg-black px-8 py-4 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-[#1c1c1a]">

                    <span className="text-[17px] font-medium">
                      Upload
                      Resume
                    </span>

                  </div>

                </label>

              ) : (

                <div className="flex items-center gap-5 rounded-2xl border border-[#176B47]/20 bg-[#F4FBF7] px-6 py-5 shadow-sm">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                    📄
                  </div>

                  <div className="flex flex-col text-left">

                    <span className="max-w-[280px] truncate text-[15px] font-semibold text-[#111111]">

                      {file.name}

                    </span>

                    <span className="text-sm text-[#6F6F69]">

                      {(
                        file.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB

                    </span>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setFile(null)
                    }
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-red-50 text-red-500 transition-all duration-200 hover:scale-105 hover:bg-red-100"
                  >
                    ✕
                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

        {/* JOB DESCRIPTION */}

        <div className="mb-14">

          <div className="mb-2 flex items-center gap-3">

            <label className="text-[20px] font-medium">

              Job description

            </label>

          </div>

          <p className="mb-5 text-sm text-[#8D877F]">

            Paste the JD to get a
            targeted skill gap
            analysis and semantic
            match score.

          </p>

          <textarea
            rows={7}
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(
                e.target.value
              )
            }
            placeholder="Paste the full job description here — requirements, responsibilities, and preferred qualifications..."
            className="w-full resize-none rounded-[24px] border border-[#DDD7CD] bg-white px-6 py-5 text-[16px] outline-none transition focus:border-[#176B47]"
          />

        </div>

        {/* ANALYSIS DEPTH */}

        <div className="mb-14">

          <h3 className="mb-5 text-[20px] font-medium">

            Analysis depth

          </h3>

          <div className="grid gap-5 md:grid-cols-2">

            <div
              onClick={() =>
                setSelectedMode(
                  "standard"
                )
              }
              className={`cursor-pointer rounded-[24px] border p-7 transition-all duration-300 ${
                selectedMode ===
                "standard"
                  ? "border-[#176B47] bg-[#F4FBF7]"
                  : "border-[#DDD7CD] bg-white hover:border-[#176B47]/30"
              }`}
            >

              <div className="mb-4 flex items-start justify-between">

                <h4 className="hero-title text-[30px]">

                  Standard

                </h4>

                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                    selectedMode ===
                    "standard"
                      ? "border-[#176B47] bg-[#176B47] text-white"
                      : "border-[#DDD7CD]"
                  }`}
                >
                  {selectedMode ===
                  "standard"
                    ? "✓"
                    : ""}
                </div>

              </div>

              <p className="leading-relaxed text-[#7A746B]">

                Skills extraction,
                experience scoring,
                education, and
                match summary.

              </p>

            </div>

            <div
              onClick={() =>
                setSelectedMode(
                  "deep"
                )
              }
              className={`cursor-pointer rounded-[24px] border p-7 transition-all duration-300 ${
                selectedMode ===
                "deep"
                  ? "border-[#176B47] bg-[#F4FBF7]"
                  : "border-[#DDD7CD] bg-white hover:border-[#176B47]/30"
              }`}
            >

              <div className="mb-4 flex items-start justify-between">

                <h4 className="hero-title text-[30px]">

                  Deep analysis

                </h4>

                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                    selectedMode ===
                    "deep"
                      ? "border-[#176B47] bg-[#176B47] text-white"
                      : "border-[#DDD7CD]"
                  }`}
                >
                  {selectedMode ===
                  "deep"
                    ? "✓"
                    : ""}
                </div>

              </div>

              <p className="leading-relaxed text-[#7A746B]">

                Everything in
                Standard + AI
                narrative, skill gap
                map, and hiring
                recommendations.

              </p>

            </div>

          </div>

        </div>

        {/* RUN ANALYSIS */}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="cursor-pointer rounded-full bg-[#176B47] px-10 py-5 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-[#14563a] disabled:cursor-not-allowed disabled:opacity-70"
        >

          {loading
            ? "Running Analysis..."
            : "Run analysis"}

        </button>

      </section>

    </main>
  );
}