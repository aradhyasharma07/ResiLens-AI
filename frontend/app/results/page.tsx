"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiDownload,
  FiFileText,
  FiXCircle,
} from "react-icons/fi";
import AppNavbar from "../components/AppNavbar";
import {
  type AnalysisResult,
  fetchStoredHistory,
  getRecommendationTone,
  parseFeedbackSections,
  readLatestResult,
  writeLatestResult,
} from "../lib/analysis";

function ScoreRing({ score, toneClassName }: { score: number; toneClassName: string }) {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative h-48 w-48">
      <svg className="h-48 w-48 -rotate-90" viewBox="0 0 180 180" aria-hidden="true">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          className={toneClassName}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <span className="hero-title text-6xl leading-none">{score}</span>
        <span className="mt-2 text-sm text-white/60">/100</span>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loadingFallback, setLoadingFallback] = useState(true);

  useEffect(() => {
    const latest = readLatestResult();
    if (latest) {
      setData(latest);
      setLoadingFallback(false);
      return;
    }

    let active = true;
    const loadFallback = async () => {
      const history = await fetchStoredHistory();
      if (active) {
        const next = history[0] ?? null;
        if (next) {
          writeLatestResult(next);
        }
        setData(next);
        setLoadingFallback(false);
      }
    };

    void loadFallback();

    return () => {
      active = false;
    };
  }, []);

  const sections = useMemo(() => parseFeedbackSections(data?.feedback), [data?.feedback]);
  const score = data?.confidence ?? 0;
  const tone = getRecommendationTone(data?.result ?? "Rejected", score);

  const aiFindings = [sections.strengths, sections.weaknesses, sections.recommendation, sections.note]
    .filter(Boolean)
    .map((item) => item as string);

  if (!data && loadingFallback) {
    return (
      <main className="min-h-screen bg-[#f8f7f4]">
        <AppNavbar mode="workspace" />
        <div className="flex min-h-screen items-center justify-center px-5 pt-24 text-[#6f6a62] md:px-8">
          Loading the latest recruiter report...
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#f8f7f4]">
        <AppNavbar mode="workspace" />
        <div className="section-shell px-5 pb-16 pt-32 md:px-8">
          <div className="surface-card rounded-[34px] p-10 text-center">
            <h1 className="hero-title text-5xl text-[#181612]">No stored analysis found</h1>
            <p className="muted-copy mt-4 text-lg">Run an analysis from the dashboard to generate a recruiter report.</p>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#1f6e4d] px-7 py-4 text-base font-semibold text-white"
            >
              Go to dashboard
              <FiArrowRight />
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-[#151411]">
      <AppNavbar mode="workspace" />

      <section className="section-shell px-5 pb-16 pt-30 md:px-8 md:pt-34">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#7b756d]"
          >
            <FiArrowLeft />
            Back to dashboard
          </button>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push("/history")}
              className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#151411]"
            >
              Open history
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#151411]"
            >
              <FiDownload />
              Save report
            </button>
          </div>
        </div>

        <div className="mb-8">
          <p className="eyebrow mb-4">Analysis complete</p>
          <h1 className="hero-title text-5xl leading-[1.02] text-[#181612] md:text-7xl">Professional recruiter report</h1>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#746e66]">
            <span className="inline-flex items-center gap-2"><FiFileText className="text-[#9b9084]" />{data.fileName}</span>
            <span>{data.time}</span>
            <span>{data.result}</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[36px] bg-[#141311] px-8 py-10 text-white shadow-[0_32px_84px_rgba(17,17,16,0.18)] md:px-10 md:py-12">
            <div className="grid items-center gap-10 lg:grid-cols-[220px_1fr]">
              <ScoreRing score={score} toneClassName={tone.ringClassName} />

              <div>
                <span className={`inline-flex rounded-full border px-4 py-1.5 text-sm font-semibold ${tone.badgeClassName}`}>
                  {tone.label}
                </span>
                <h2 className="hero-title mt-5 text-5xl leading-none text-white md:text-6xl">{tone.headline}</h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">
                  {sections.recommendation || sections.body || data.feedback || "The backend has completed analysis for this candidate."}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="hero-title text-4xl">{data.matchedSkills?.length ?? 0}</p>
                    <p className="mt-2 text-sm text-white/55">Matched skills</p>
                  </div>
                  <div>
                    <p className="hero-title text-4xl">{sections.missingSkills.length}</p>
                    <p className="mt-2 text-sm text-white/55">Missing signals</p>
                  </div>
                  <div>
                    <p className={`text-2xl font-semibold ${tone.accentClassName}`}>{data.result}</p>
                    <p className="mt-2 text-sm text-white/55">Final recommendation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="surface-card rounded-[34px] p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a8379]">Shortlisting decision</p>
              <h2 className="hero-title mt-2 text-4xl text-[#181612]">{data.result === "Shortlisted" ? "Move this candidate forward" : "Hold this candidate back"}</h2>
              <p className="mt-4 text-base leading-8 text-[#6f6a62]">
                {data.result === "Shortlisted"
                  ? "The current backend result supports a shortlist recommendation for this role."
                  : "The current backend result does not support shortlisting this candidate yet."}
              </p>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#12110f] px-6 py-3.5 text-sm font-semibold text-white"
              >
                Continue screening
                <FiArrowRight />
              </button>
            </div>

            <div className="surface-card rounded-[34px] p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a8379]">Skill coverage</p>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[#2b2823]">Matched skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {(data.matchedSkills ?? []).length > 0 ? (
                      data.matchedSkills?.map((skill) => (
                        <span key={skill} className="rounded-full border border-[#d7e6dc] bg-[#edf6f0] px-3 py-1.5 text-sm font-medium text-[#23684a]">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-[#7a746c]">No structured matched skills were returned.</span>
                    )}
                  </div>
                </div>

                {sections.missingSkills.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-[#2b2823]">Missing skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {sections.missingSkills.map((skill) => (
                        <span key={skill} className="rounded-full border border-[#efcccc] bg-[#fff3f1] px-3 py-1.5 text-sm font-medium text-[#bb4c4c]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-8">
            <div className="surface-card rounded-[34px] p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a8379]">Recruiter feedback</p>
              <div className="mt-6 space-y-5 text-base leading-8 text-[#47413a]">
                {sections.strengths && (
                  <div>
                    <h3 className="mb-2 font-semibold text-[#1b1915]">Strengths</h3>
                    <p>{sections.strengths}</p>
                  </div>
                )}
                {sections.weaknesses && (
                  <div>
                    <h3 className="mb-2 font-semibold text-[#1b1915]">Concerns</h3>
                    <p>{sections.weaknesses}</p>
                  </div>
                )}
                {!sections.strengths && !sections.weaknesses && <p>{data.feedback}</p>}
              </div>
            </div>

            <div className="surface-card rounded-[34px] p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a8379]">Resume preview</p>
              <div className="mt-5 max-h-140 overflow-y-auto rounded-[26px] border border-black/8 bg-white/75 p-6 text-sm leading-7 text-[#4c4640] whitespace-pre-wrap">
                {data.preview || "No resume preview available."}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="surface-card rounded-[34px] p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a8379]">AI findings</p>
              <h2 className="hero-title mt-2 text-4xl text-[#181612]">What the analysis found</h2>
              <div className="mt-6 space-y-4">
                {aiFindings.length > 0 ? (
                  aiFindings.map((item, index) => (
                    <div key={`${item}-${index}`} className="flex items-start gap-3 rounded-[22px] border border-black/8 bg-white/68 px-4 py-4 text-sm leading-7 text-[#4c4640]">
                      {index < 2 ? (
                        <FiCheckCircle className="mt-1 shrink-0 text-[#2f8a63]" />
                      ) : (
                        <FiXCircle className="mt-1 shrink-0 text-[#c25555]" />
                      )}
                      <span>{item}</span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[22px] border border-black/8 bg-white/68 px-4 py-4 text-sm leading-7 text-[#4c4640]">
                    {data.feedback}
                  </div>
                )}
              </div>
            </div>

            {sections.method && (
              <div className="surface-card rounded-[34px] p-6 md:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a8379]">Method</p>
                <p className="mt-4 text-base leading-8 text-[#5c564f]">{sections.method}</p>
              </div>
            )}

            {sections.remaining.length > 0 && (
              <div className="surface-card rounded-[34px] p-6 md:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a8379]">Additional details</p>
                <div className="mt-5 space-y-4 text-sm leading-7 text-[#4c4640] whitespace-pre-wrap">
                  {sections.remaining.map((item) => (
                    <div key={item} className="rounded-[22px] border border-black/8 bg-white/68 px-4 py-4">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}