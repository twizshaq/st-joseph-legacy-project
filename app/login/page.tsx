"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import GoogleIcon from "@/public/icons/google-icon.svg"; // Make sure this path is correct
import { createClient } from "@/lib/supabase/client"; // Adjust path if needed

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();

  const searchParams = useSearchParams();

  // If the page was opened with ?view=signup, show the sign up form by default.
  useEffect(() => {
    const view = searchParams?.get("view");
    if (view === "signup") {
      setIsLoginView(false);
    }
  }, [searchParams]);

  // View state
  const [isLoginView, setIsLoginView] = useState(true);

  // Form fields state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Slideshow component
  function Slideshow() {
    const images = ["/pic1.jpg", "/pic2.jpg", "/pic3.jpg"];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="absolute inset-0 h-full w-full overflow-hidden rounded-l-xl">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Decorative slideshow"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    );
  }

  // --- AUTHENTICATION HANDLERS ---
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        data: {
        // Add the combined full_name for consistency
        full_name: `${firstName} ${lastName}`.trim(), 
        // Keep the individual fields too, it's good practice
        first_name: firstName,
        last_name: lastName,
        },
    },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Success! Please check your email for a verification link.");
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/profile");
      router.refresh();
    }
    setLoading(false);
  };
  
  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/profile` },
    });
  };

  // --- UI HELPER FUNCTIONS ---
  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    setMessage(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const inputStyles = "w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <>
      <video autoPlay loop muted playsInline className="fixed top-0 left-0 -z-10 h-screen w-screen min-h-full min-w-full object-cover">
        <source src="/video.mp4" type="video/mp4" />
      </video>

      <div className="fixed top-1/2 left-1/2 flex w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white/60 shadow-lg backdrop-blur-sm md:max-w-4xl">
        <div className="relative hidden w-2/5 flex-col items-center justify-end p-8 text-white md:flex">
          <Slideshow />
          <div className="relative z-10 text-center">
            <h1 className="mb-2 font-serif text-4xl font-bold">{isLoginView ? "Welcome Back" : "Create your Account"}</h1>
            <p>{isLoginView ? "Connect with your world in one click." : "Sign up to unlock all features."}</p>
          </div>
        </div>

        <form onSubmit={isLoginView ? handleLogin : handleSignUp} className="w-full bg-white p-6 md:w-3/5 md:p-8 overflow-y-auto">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">{isLoginView ? "Login" : "Sign Up"}</h1>
          <p className="mb-6 text-sm text-gray-600">
            {isLoginView ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" onClick={toggleView} className="font-semibold text-blue-600 hover:underline">
              {isLoginView ? "Sign up" : "Log in"}
            </button>
          </p>

          {!isLoginView && (
            <div className="flex flex-col gap-4 md:flex-row">
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required className={inputStyles} />
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required className={inputStyles} />
            </div>
          )}

          <div className="mt-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className={inputStyles} />
          </div>

          <div className="relative mt-4">
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className={inputStyles} />
            <button type="button" className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          {!isLoginView && (
            <div className="relative mt-4">
              <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required className={inputStyles} />
              <button type="button" className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          )}
          
          {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
          {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}

          <button type="submit" disabled={loading} className="mt-6 w-full rounded-full bg-gradient-to-b from-blue-500 to-blue-600 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Loading..." : (isLoginView ? "Login" : "Create Account")}
          </button>
          
          <div className="relative my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 flex-shrink text-sm text-gray-500">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <div className="flex justify-center">
            {/* --- FIXED BUTTON --- */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="cursor-pointer flex flex-row items-center gap-[10px] rounded-full border-[2px] border-white bg-black/40 py-[10px] px-[20px] font-bold text-white shadow-[0_0px_30px_rgba(0,0,0,0.2)] transition-colors hover:bg-black/60"
            >
              <Image src={GoogleIcon} alt="Google Icon" height={24} />
              Sign in with Google
            </button>
          </div>
        </form>
      </div>
    </>
  );
}