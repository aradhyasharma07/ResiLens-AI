"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [totalAnalyses, setTotalAnalyses] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(savedUser));
    fetchHistoryCount();
  }, []);

  const fetchHistoryCount = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/history"
      );

      const data = await response.json();
      setTotalAnalyses(data.length || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("latestResult");
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    router.push("/login");
  };

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">
        <p className="text-gray-500 text-lg">
          Loading profile...
        </p>
      </main>
    );
  }

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

            <button className="text-[#176B47] font-medium">
              Profile
            </button>
          </div>

        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-8 py-10">

        <p className="text-sm uppercase tracking-[0.2em] text-[#1C6B4A] mb-4">
          Account
        </p>

        <h1 className="text-6xl hero-title mb-4">
          Profile Settings
        </h1>

        <p className="text-lg text-gray-500 mb-12">
          Manage your account details and workspace settings.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT PROFILE CARD */}
          <div className="bg-white rounded-[32px] border border-black/5 p-8">

            <div className="flex flex-col items-center text-center">

              {user.picture ? (
                <img
                  src={user.picture}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover mb-6"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-[#176B47] text-white flex items-center justify-center text-4xl font-bold mb-6">
                  {user.name?.charAt(0)}
                </div>
              )}

              <h2 className="text-3xl hero-title mb-2">
                {user.name}
              </h2>

              <p className="text-gray-500 mb-4">
                {user.email}
              </p>

              <span className="px-4 py-2 rounded-full bg-[#F4FBF7] text-[#176B47] text-sm">
                {user.loginType}
              </span>

            </div>

          </div>

          {/* RIGHT DETAILS */}
          <div className="lg:col-span-2 space-y-8">

            <div className="bg-white rounded-[32px] border border-black/5 p-8">

              <h2 className="text-3xl hero-title mb-6">
                Personal Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Full Name
                  </p>
                  <p className="text-lg font-medium">
                    {user.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Email Address
                  </p>
                  <p className="text-lg font-medium">
                    {user.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Joined On
                  </p>
                  <p className="text-lg font-medium">
                    {user.joinedAt}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Login Method
                  </p>
                  <p className="text-lg font-medium">
                    {user.loginType}
                  </p>
                </div>

              </div>

            </div>

            <div className="bg-white rounded-[32px] border border-black/5 p-8">

              <h2 className="text-3xl hero-title mb-6">
                Workspace Summary
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                <div>
                  <p className="text-5xl hero-title">
                    {totalAnalyses}
                  </p>
                  <p className="text-gray-500 mt-2">
                    Total Resumes Analyzed
                  </p>
                </div>

                <div>
                  <p className="text-5xl hero-title">
                    Standard
                  </p>
                  <p className="text-gray-500 mt-2">
                    Preferred Analysis Mode
                  </p>
                </div>

              </div>

            </div>

            <div className="bg-white rounded-[32px] border border-black/5 p-8">

              <h2 className="text-3xl hero-title mb-6">
                Account Actions
              </h2>

              <button
                onClick={handleLogout}
                className="px-8 py-4 rounded-full bg-black text-white"
              >
                Logout →
              </button>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}