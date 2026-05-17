import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Outfit,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RecruiterAssistantChatbot from "./components/RecruiterAssistantChatbot";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ResiLens AI",
  description: "Intelligent Resume Screening System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${cormorant.variable}
          ${outfit.variable}
          ${jetbrainsMono.variable}
          bg-[#F8F7F4]
          text-[#111110]
          min-h-screen
          antialiased
        `}
      >
        <GoogleOAuthProvider clientId="308387073138-bcrqcfbtvq7frf2bpbrda018k0u2lr29.apps.googleusercontent.com">
          {children}
          <RecruiterAssistantChatbot />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}