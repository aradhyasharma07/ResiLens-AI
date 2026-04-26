export type AnalysisResult = {
  _id?: string;
  fileName: string;
  result: "Shortlisted" | "Rejected" | string;
  confidence: number;
  time: string;
  preview?: string;
  feedback?: string;
  matchedSkills?: string[];
};

export type FeedbackSections = {
  title?: string;
  body?: string;
  decision?: string;
  recommendation?: string;
  strengths?: string;
  weaknesses?: string;
  missingSkills: string[];
  method?: string;
  note?: string;
  remaining: string[];
};

const FEEDBACK_SECTION_PATTERN = /\*\*(.+?)\*\*\n([\s\S]*?)(?=\n\n\*\*|$)/g;

export function parseFeedbackSections(feedback: string | undefined): FeedbackSections {
  const sections: FeedbackSections = {
    missingSkills: [],
    remaining: [],
  };

  if (!feedback) {
    return sections;
  }

  let match: RegExpExecArray | null;

  while ((match = FEEDBACK_SECTION_PATTERN.exec(feedback)) !== null) {
    const heading = match[1].trim().toLowerCase();
    const content = match[2].trim();

    switch (heading) {
      case "match score:":
      case "match score":
        sections.title = content;
        break;
      case "decision:":
      case "decision":
        sections.decision = content;
        break;
      case "recommendation":
        sections.recommendation = content;
        break;
      case "strengths":
        sections.strengths = content;
        break;
      case "weaknesses":
        sections.weaknesses = content;
        break;
      case "missing skills":
        sections.missingSkills = splitSkills(content);
        break;
      case "method":
        sections.method = content;
        break;
      case "note":
        sections.note = content;
        break;
      default:
        sections.remaining.push(`**${match[1].trim()}**\n${content}`);
        break;
    }
  }

  if (!sections.recommendation) {
    const paragraphs = feedback
      .split(/\n\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
    if (paragraphs.length > 0) {
      sections.body = paragraphs[0];
    }
  }

  return sections;
}

export function splitSkills(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && item.toLowerCase() !== "none identified");
}

export function getRecommendationTone(result: string, score: number) {
  if (result === "Shortlisted" && score >= 75) {
    return {
      label: "Strong Match",
      headline: "Highly recommended",
      accentClassName: "text-[#2f8a63]",
      badgeClassName: "border-[#3d8d69]/30 bg-[#edf6f0] text-[#226d4d]",
      ringClassName: "stroke-[#2f8a63]",
    };
  }

  if (result === "Shortlisted") {
    return {
      label: "Moderate Match",
      headline: "Recommended with review",
      accentClassName: "text-[#c07a14]",
      badgeClassName: "border-[#dca44f]/30 bg-[#fff7e9] text-[#9e6513]",
      ringClassName: "stroke-[#d48d1d]",
    };
  }

  return {
    label: "Weak Match",
    headline: "Not recommended",
    accentClassName: "text-[#c44848]",
    badgeClassName: "border-[#e7b2b2]/40 bg-[#fff2f1] text-[#b23a3a]",
    ringClassName: "stroke-[#d35858]",
  };
}

export function readLocalHistory(): AnalysisResult[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem("resumeHistory");
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as AnalysisResult[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeLocalHistory(history: AnalysisResult[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem("resumeHistory", JSON.stringify(history));
}

export function readLatestResult(): AnalysisResult | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem("latestResult");
    return raw ? (JSON.parse(raw) as AnalysisResult) : null;
  } catch {
    return null;
  }
}

export function writeLatestResult(result: AnalysisResult) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem("latestResult", JSON.stringify(result));
}

export async function fetchStoredHistory(): Promise<AnalysisResult[]> {
  try {
    const response = await fetch("http://127.0.0.1:8000/history", {
      cache: "no-store",
    });

    if (!response.ok) {
      return readLocalHistory();
    }

    const data = (await response.json()) as AnalysisResult[] | { error?: string };
    if (!Array.isArray(data)) {
      return readLocalHistory();
    }

    writeLocalHistory(data);
    return data;
  } catch {
    return readLocalHistory();
  }
}

export function getHistoryMetrics(history: AnalysisResult[]) {
  const total = history.length;
  const shortlisted = history.filter((item) => item.result === "Shortlisted").length;
  const rejected = history.filter((item) => item.result === "Rejected").length;
  const averageScore = total > 0
    ? Math.round(history.reduce((sum, item) => sum + Number(item.confidence || 0), 0) / total)
    : 0;

  const latestRun = history[0]?.time ?? "No analyses yet";

  return {
    total,
    shortlisted,
    rejected,
    averageScore,
    latestRun,
  };
}