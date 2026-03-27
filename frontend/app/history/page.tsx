"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import router from "next/router";

export default function HistoryPage() {
const router = useRouter();
useEffect(() => {
const loggedIn = localStorage.getItem("loggedIn");
if (!loggedIn) {
router.push("/login");
}
}, []);
const [history, setHistory] = useState<any[]>([]);

useEffect(() => {
const data = JSON.parse(localStorage.getItem("history") || "[]");
setHistory(data);
}, []);

return (
<main className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 text-white p-10">

  <h1 className="text-3xl font-bold mb-8">
    Resume History
  </h1>

  {history.length === 0 ? (
    <p className="text-gray-400">
      No resumes analyzed yet.
    </p>
  ) : (
    <div className="space-y-4">

      {history.map((item, i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between"
        >
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-gray-400">{item.time}</p>
          </div>

          <div className="text-right">
            <p>{item.result}</p>
            <p className="text-sm text-gray-400">
              {item.confidence}%
            </p>
          </div>
        </div>
      ))}

    </div>
  )}

  <button
    onClick={() => router.push("/dashboard")}
    className="mt-8 bg-indigo-600 px-6 py-2 rounded-lg"
  >
    Back to Dashboard
  </button>

</main>

);
}