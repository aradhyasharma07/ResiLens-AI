"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { FaUserCircle, FaUpload } from "react-icons/fa";
import router from "next/router";

export default function Dashboard() {
const router = useRouter();
useEffect(() => 
    {const loggedIn = 
        localStorage.getItem("loggedIn");
        if (!loggedIn) {
            router.push("/login");
}
},[]);

const [file, setFile] = useState<File | null>(null);
const [preview, setPreview] = useState<string>("");

const [result, setResult] = useState<string | null>(null);
const [confidence, setConfidence] = useState<number>(0);

const logout = () => {
localStorage.removeItem("isLoggedIn");
router.push("/login");
};

const handleUpload = async () => {
if (!file) {
alert("Please select a file first");
return;
}

try {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:8000/predict-file", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  setPreview(data.text_preview || "No preview available");
  setResult(data.result);
  setConfidence(data.confidence);

  const history = JSON.parse(localStorage.getItem("history") || "[]");

history.unshift({
name: file.name,
result: data.result,
confidence: data.confidence,
time: new Date().toLocaleString(),
});

localStorage.setItem("history", JSON.stringify(history));
} catch (error) {
  alert("Error connecting to backend");
}

};

return (
<main className="min-h-screen bg-linear-to-br from-black via-indigo-950 to-purple-950 text-white">

  {/* Navbar */}
  <nav className="flex items-center justify-between px-8 py-4 bg-white/5 backdrop-blur border-b border-white/10">

    <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
      ResiLens AI
    </h1>

    <div className="flex items-center gap-8 font-medium text-gray-300">

      <button className="hover:text-white transition">
        Dashboard
      </button>

      <button
        onClick={() => router.push("/history")}
        className="hover:text-white transition"
      >
        History
      </button>

      <button className="flex items-center gap-2 hover:text-white transition">
        <FaUserCircle size={20} />
        Profile
      </button>

      <button
        onClick={logout}
        className="bg-red-500/80 hover:bg-red-600 px-4 py-1 rounded-lg text-white transition"
      >
        Logout
      </button>
    </div>
  </nav>

  {/* Main Grid */}
  <section className="grid grid-cols-2 gap-8 p-10">

{/* Upload Panel */}
<div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-xl">

  <h2 className="text-xl font-semibold mb-4">
    Upload Resume
  </h2>

  <div className="h-[280px] border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-center gap-4 hover:border-indigo-500/50 transition">

    <FaUpload className="text-5xl text-gray-400" />

    {/* Hidden file input */}
    <input
      id="resumeUpload"
      type="file"
      accept=".pdf,.txt"
      onChange={(e) =>
        setFile(e.target.files ? e.target.files[0] : null)
      }
      className="hidden"
    />

    {/* Custom Choose File button */}
    <label
      htmlFor="resumeUpload"
      className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg shadow font-medium transition"
    >
      Choose File
    </label>

    {/* File name display */}
    <p className="text-sm text-gray-400">
      {file ? file.name : "No file chosen"}
    </p>

    {/* Analyze button */}
    <button
      onClick={handleUpload}
      className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg transition shadow font-medium"
    >
      Analyze Resume
    </button>

  </div>

</div>



    {/* Preview Panel */}
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-xl">

      <h2 className="text-xl font-semibold mb-4">
        Resume Preview
      </h2>

      {/* Result + Confidence */}
      {result && (
        <div className="mb-4">

          <div
            className={`px-4 py-2 rounded-lg font-semibold text-center mb-2 ${
              result === "Shortlisted"
                ? "bg-green-500/20 text-green-400"
                : result === "Needs Review"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {result}
          </div>

          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-indigo-500 to-purple-500 transition-all duration-700"
              style={{ width: `${confidence}%` }}
            />
          </div>

          <p className="text-sm text-gray-400 mt-1 text-center">
            Confidence: {confidence}%
          </p>

        </div>
      )}

      {/* Preview Text */}
      <div className="h-62.5 overflow-y-auto border border-white/20 rounded-xl p-4 text-gray-300 whitespace-pre-wrap">

        {preview || "Preview will appear here after upload..."}

      </div>

    </div>

  </section>
</main>

);
}