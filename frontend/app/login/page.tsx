"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { GoogleLogin } from "@react-oauth/google";

import { jwtDecode } from "jwt-decode";

import {
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

export default function LoginPage() {

  const router = useRouter();

  const [isSignup, setIsSignup] =
    useState(false);

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [isError, setIsError] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const handleAuth = async () => {

    setMessage("");

    setIsError(false);

    setLoading(true);

    const endpoint = isSignup
      ? "http://127.0.0.1:8000/signup"
      : "http://127.0.0.1:8000/login";

    const payload = isSignup

      ? {
          name: fullName,
          email,
          password,
        }

      : {
          email,
          password,
        };

    try {

      const res = await fetch(
        endpoint,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

      const data =
        await res.json();

      if (data.error) {

        setMessage(
          data.error
        );

        setIsError(true);

        setLoading(false);

        return;
      }

      if (isSignup) {

        localStorage.setItem(
          "user",

          JSON.stringify({

            name: fullName,

            email: email,

            picture: "",

            loginType:
              "Email Signup",

            joinedAt:
              new Date().toLocaleDateString(),
          })
        );

        setMessage(
          "Account created successfully"
        );

        setIsError(false);

        router.push(
          "/dashboard"
        );

      } else {

        localStorage.setItem(
          "user",

          JSON.stringify({

            name:
              data?.user?.name ||
              "ResiLens User",

            email:
              data?.user?.email ||
              email,

            picture: "",

            loginType:
              "Email Login",

            joinedAt:
              new Date().toLocaleDateString(),
          })
        );

        setMessage(
          "Login successful"
        );

        setIsError(false);

        router.push(
          "/dashboard"
        );
      }

    } catch {

      setMessage(
        "Backend not running"
      );

      setIsError(true);

    } finally {

      setLoading(false);
    }
  };

  const handleGoogleSuccess =
    async (
      credentialResponse: any
    ) => {

      try {

        const decoded: any =
          jwtDecode(
            credentialResponse.credential
          );

        await fetch(
          "http://127.0.0.1:8000/google-login",

          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              email:
                decoded.email,

              name:
                decoded.name,
            }),
          }
        );

        localStorage.setItem(

          "user",

          JSON.stringify({

            name:
              decoded.name,

            email:
              decoded.email,

            picture:
              decoded.picture || "",

            loginType:
              "Google",

            joinedAt:
              new Date().toLocaleDateString(),
          })
        );

        router.push(
          "/dashboard"
        );

      } catch {

        setMessage(
          "Google authentication failed"
        );

        setIsError(true);
      }
    };

  return (

    <main className="min-h-screen bg-[#F7F5F0]">

      <nav className="w-full border-b border-black/5 bg-[#F7F5F0]/95 backdrop-blur-md sticky top-0 z-50">

        <div className="max-w-[1400px] mx-auto px-8 py-5 flex items-center justify-between">

          <div
            onClick={() =>
              router.push("/")
            }
            className="text-[38px] luxury-font cursor-pointer"
          >
            ResiLens
            <span className="text-[#176B47]">
              .AI
            </span>
          </div>

        </div>

      </nav>

      <section className="grid lg:grid-cols-2 min-h-[calc(100vh-88px)]">

        <div className="bg-black text-white p-16 flex flex-col justify-between relative overflow-hidden">

          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,#176B47,transparent_35%),radial-gradient(circle_at_bottom_right,#176B47,transparent_30%)]"></div>

          <div className="relative z-10">

            <div className="text-[34px] luxury-font mb-20">
              ResiLens
              <span className="text-[#176B47]">
                .AI
              </span>
            </div>

            <h1 className="text-[56px] leading-tight hero-title italic max-w-xl">

              “Screening is not about filtering people out
              <br />
              — it's about finding the right one.”

            </h1>

            <p className="mt-8 text-[#B8B8B8] text-lg">
              — ResiLens AI Philosophy
            </p>

          </div>

          <div className="relative z-10 space-y-5 text-[#D6D6D6] text-[15px]">

            <p>
              • Analyze resumes in under 3 seconds
            </p>

            <p>
              • Match candidates to your exact JD
            </p>

            <p>
              • Track and compare across a dashboard
            </p>

            <p>
              • Powered by AI + NLP
            </p>

          </div>

        </div>

        <div className="flex items-center justify-center px-10 py-16">

          <div className="w-full max-w-[520px]">

            <h2 className="text-[58px] hero-title leading-none mb-3">
              Welcome back
            </h2>

            <p className="text-[#7A746B] text-lg mb-10">

              Sign in to your ResiLens AI workspace

            </p>

            <div className="bg-[#ECE8DF] rounded-full p-1 flex mb-10">

              <button
                onClick={() =>
                  setIsSignup(false)
                }
                className={`flex-1 py-4 rounded-full text-sm font-medium cursor-pointer ${
                  !isSignup
                    ? "bg-white shadow-sm"
                    : "text-[#7A746B]"
                }`}
              >
                Sign in
              </button>

              <button
                onClick={() =>
                  setIsSignup(true)
                }
                className={`flex-1 py-4 rounded-full text-sm font-medium cursor-pointer ${
                  isSignup
                    ? "bg-white shadow-sm"
                    : "text-[#7A746B]"
                }`}
              >
                Create account
              </button>

            </div>

            {isSignup && (

              <div className="mb-5">

                <label className="block text-sm mb-2">
                  Full name
                </label>

                <input
                  type="text"
                  placeholder="Your name"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(
                      e.target.value
                    )
                  }
                  className="w-full rounded-[20px] border border-[#DDD7CD] bg-white px-5 py-4 outline-none"
                />

              </div>
            )}

            <div className="mb-5">

              <label className="block text-sm mb-2">
                Email address
              </label>

              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="w-full rounded-[20px] border border-[#DDD7CD] bg-white px-5 py-4 outline-none"
              />

            </div>

            <div className="mb-4">

              <label className="block text-sm mb-2">
                Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder={
                    isSignup
                      ? "Create a strong password"
                      : "••••••••"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="w-full rounded-[20px] border border-[#DDD7CD] bg-white px-5 py-4 pr-14 outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {
                    showPassword

                    ? <FiEyeOff size={20} />

                    : <FiEye size={20} />
                  }
                </button>

              </div>

            </div>

            {!isSignup && (

              <div className="flex justify-between text-sm mb-6 text-[#7A746B]">

                <label className="cursor-pointer">

                  <input
                    type="checkbox"
                    className="mr-2 cursor-pointer"
                  />

                  Remember me

                </label>

                <span className="text-[#176B47] cursor-pointer">
                  Forgot password?
                </span>

              </div>
            )}

            {message && (

              <p
                className={`mb-5 ${
                  isError
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                {message}
              </p>
            )}

            <button
              onClick={handleAuth}
              disabled={loading}
              className={`w-full py-4 rounded-full text-white text-lg font-medium cursor-pointer ${
                isSignup
                  ? "bg-[#176B47]"
                  : "bg-black"
              }`}
            >
              {
                loading

                ? (
                    isSignup
                    ? "Creating..."
                    : "Signing in..."
                  )

                : (
                    isSignup
                    ? "Create account →"
                    : "Sign in →"
                  )
              }
            </button>

            <div className="mt-8">

              <div className="flex items-center gap-4 mb-6">

                <div className="flex-1 h-[1px] bg-[#E5DED3]"></div>

                <p className="text-sm text-[#9C958C]">
                  or
                </p>

                <div className="flex-1 h-[1px] bg-[#E5DED3]"></div>

              </div>

              <div className="flex justify-center">

                <GoogleLogin
                  onSuccess={
                    handleGoogleSuccess
                  }
                  onError={() => {

                    setMessage(
                      "Google authentication failed"
                    );

                    setIsError(true);
                  }}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                />

              </div>

            </div>

            <p className="text-center mt-8 text-sm text-[#7A746B]">

              {
                isSignup

                ? "Already have an account?"

                : "Don't have an account?"
              }

              <span
                onClick={() =>
                  setIsSignup(
                    !isSignup
                  )
                }
                className="ml-2 text-[#176B47] font-medium cursor-pointer"
              >
                {
                  isSignup
                    ? "Sign in"
                    : "Sign up free"
                }
              </span>

            </p>

          </div>

        </div>

      </section>

    </main>
  );
}