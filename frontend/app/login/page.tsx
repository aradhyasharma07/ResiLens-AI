"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = () => {
    if (!username || !password) {
      alert("Fill all fields");
      return;
    }

    if (tab === "signup") {
      localStorage.setItem(
        "user",
        JSON.stringify({ username, password })
      );
      alert("Account created. Please login.");
      setTab("login");
      return;
    }

    const saved = JSON.parse(localStorage.getItem("user") || "{}");

    if (saved.username === username && saved.password === password) {
      localStorage.setItem("loggedIn", "true");
      router.push("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black">

      {/* Glass Card */}
      <div className="w-[420px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-white">

        {/* Logo */}
        <h1 className="text-3xl font-bold text-center mb-6">
          ResiLens AI
        </h1>

        {/* Tabs */}
        <div className="flex mb-6 bg-white/10 rounded-lg overflow-hidden">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-2 font-semibold transition ${
              tab === "login"
                ? "bg-white/20"
                : "hover:bg-white/10"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setTab("signup")}
            className={`flex-1 py-2 font-semibold transition ${
              tab === "signup"
                ? "bg-white/20"
                : "hover:bg-white/10"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Username */}
        <div className="flex items-center bg-white/10 rounded-lg mb-4 px-3">
          <FaUser className="mr-2 opacity-70" />
          <input
            className="w-full py-3 bg-transparent outline-none placeholder-white/60"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="flex items-center bg-white/10 rounded-lg mb-6 px-3">
          <FaLock className="mr-2 opacity-70" />
          <input
            type="password"
            className="w-full py-3 bg-transparent outline-none placeholder-white/60"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition"
        >
          {tab === "login" ? "Login" : "Create Account"}
        </button>

        {/* Footer text */}
        <p className="text-center text-sm text-white/70 mt-4">
          {tab === "login"
            ? "No account? Switch to Sign Up"
            : "Already have an account? Switch to Login"}
        </p>
      </div>
    </main>
  );
}