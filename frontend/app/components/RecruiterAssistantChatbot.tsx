"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FiMessageSquare, FiSend, FiX, FiLoader } from "react-icons/fi";

type MessageRole = "assistant" | "user";

type ChatMessage = {
  role: MessageRole;
  content: string;
};

type ChatApiResponse = {
  reply?: string;
  error?: string;
};

const SESSION_STORAGE_OPEN_KEY = "recruiterAssistantOpen";
const SESSION_STORAGE_MESSAGES_KEY = "recruiterAssistantMessages";

const starterMessage: ChatMessage = {
  role: "assistant",
  content:
    "Hello! I am your ResiLens Recruiter Assistant. Ask me why a candidate was rejected, what skills are missing, or how to improve shortlist quality.",
};

export default function RecruiterAssistantChatbot() {
  const pathname = usePathname();
  const shouldHideChatbot = pathname === "/" || pathname === "/login";

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedOpen = sessionStorage.getItem(SESSION_STORAGE_OPEN_KEY);
    const savedMessages = sessionStorage.getItem(SESSION_STORAGE_MESSAGES_KEY);

    if (savedOpen === "1") {
      setIsOpen(true);
    }

    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch {
        setMessages([starterMessage]);
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_OPEN_KEY, isOpen ? "1" : "0");
  }, [isOpen]);

  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages, isOpen]);

  const quickPrompts = useMemo(
    () => [
      "Why was this candidate rejected?",
      "What skills are missing for this role?",
      "Suggest resume improvements before interview.",
      "What interview questions should I ask for this candidate?",
    ],
    []
  );

  const getChatContext = () => {
    const latestRaw = localStorage.getItem("latestResult");
    const historyRaw = localStorage.getItem("resumeHistory");

    let latestResult: unknown = null;
    let shortlistedCount = 0;
    let rejectedCount = 0;

    if (latestRaw) {
      try {
        latestResult = JSON.parse(latestRaw);
      } catch {
        latestResult = null;
      }
    }

    if (historyRaw) {
      try {
        const parsedHistory = JSON.parse(historyRaw) as Array<{ result?: string }>;
        shortlistedCount = parsedHistory.filter((item) => item.result === "Shortlisted").length;
        rejectedCount = parsedHistory.filter((item) => item.result === "Rejected").length;
      } catch {
        shortlistedCount = 0;
        rejectedCount = 0;
      }
    }

    return {
      latestResult,
      shortlistedCount,
      rejectedCount,
    };
  };

  const sendMessage = async (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message || isSending) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: message,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history: nextMessages,
          context: getChatContext(),
        }),
      });

      const data = (await response.json()) as ChatApiResponse;

      if (!response.ok || data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.error ||
              "I could not process that right now. Please check backend connection and try again.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.reply ||
              "I could not generate a response. Please try a more specific question.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Unable to reach recruiter assistant backend. Ensure FastAPI server is running.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return shouldHideChatbot ? null : (
    <div className="fixed bottom-6 right-6 z-1200">
      <div
        className={`mb-4 w-90 max-w-[calc(100vw-2rem)] origin-bottom-right transition-all duration-300 ease-out ${
          isOpen
            ? "translate-y-0 scale-100 opacity-100 pointer-events-auto"
            : "translate-y-6 scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden rounded-[26px] border border-black/10 bg-[#fcfcf8] shadow-[0_24px_80px_rgba(17,17,16,0.14)] backdrop-blur-sm">
          <div className="bg-black px-5 py-4 text-white">
            <p className="text-sm uppercase tracking-[0.18em] text-[#9ad3b8]">Recruiter Assistant</p>
            <h3 className="hero-title text-3xl leading-none">🤖 ResiL Bot</h3>
          </div>

          <div ref={containerRef} className="max-h-95 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((msg, idx) => (
              <div
                key={`${msg.role}-${idx}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-md bg-[#1c6b4a] text-white"
                      : "rounded-bl-md border border-black/10 bg-white text-[#1f1f1c]"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-black/10 bg-white px-4 py-3 text-sm text-[#4b4b4a]">
                  <FiLoader className="animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-black/5 px-4 py-3">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  disabled={isSending}
                  className="whitespace-nowrap rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-[#444] hover:border-[#1c6b4a] hover:text-[#1c6b4a] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void sendMessage(input);
                  }
                }}
                placeholder="Ask about candidate quality, fit, or interview strategy..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#8b8b88]"
              />
              <button
                type="button"
                onClick={() => void sendMessage(input)}
                disabled={isSending || !input.trim()}
                className="grid h-9 w-9 place-items-center rounded-full bg-black text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group ml-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-[0_14px_40px_rgba(17,17,16,0.28)] transition-all duration-300 hover:scale-105"
        aria-label={isOpen ? "Close recruiter assistant" : "Open recruiter assistant"}
      >
        <span className="absolute h-16 w-16 rounded-full border border-[#1c6b4a]/40 opacity-80 transition-transform duration-500 group-hover:scale-125" />
        {isOpen ? <FiX className="relative text-2xl" /> : <FiMessageSquare className="relative text-2xl" />}
      </button>
    </div>
  );
}
