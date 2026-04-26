"use client";

import { usePathname, useRouter } from "next/navigation";

type NavMode = "public" | "workspace";

type AppNavbarProps = {
  mode?: NavMode;
};

const PUBLIC_LINKS = [
  { label: "Home", href: "/" },
  { label: "Analyze", href: "/login" },
  { label: "Dashboard", href: "/login" },
  { label: "Sign in", href: "/login" },
];

const WORKSPACE_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Results", href: "/results" },
  { label: "History", href: "/history" },
  { label: "Logout", href: "/login" },
];

export default function AppNavbar({ mode = "public" }: AppNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const links = mode === "workspace" ? WORKSPACE_LINKS : PUBLIC_LINKS;
  const ctaTarget = mode === "workspace" ? "/dashboard" : "/login";
  const ctaLabel = mode === "workspace" ? "Analyze resume" : "Get started";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-black/6 bg-[rgba(248,247,244,0.85)] backdrop-blur-xl">
      <div className="mx-auto flex w-full items-center justify-between px-5 py-5 md:px-8" style={{ maxWidth: 1180 }}>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="hero-title text-[2rem] tracking-[-0.04em] text-[#1a1815]"
        >
          Resilens
          <span className="text-[#2c7a58]">.AI</span>
        </button>

        <div className="hidden items-center gap-9 text-sm font-medium text-[#7c776f] md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <button
                key={link.href}
                type="button"
                onClick={() => router.push(link.href)}
                className={isActive ? "text-[#1a1815]" : "hover:text-[#1a1815]"}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => router.push(ctaTarget)}
          className="rounded-full bg-[#12110f] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(18,17,15,0.15)] transition hover:-translate-y-px hover:shadow-[0_22px_44px_rgba(18,17,15,0.18)]"
        >
          {ctaLabel}
        </button>
      </div>
    </nav>
  );
}