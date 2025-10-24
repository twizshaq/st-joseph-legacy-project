"use client";

import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import GoogleIcon from "@/public/icons/google-icon.svg";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  // --- STATE MANAGEMENT ---
  const [isLogin, setIsLogin] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  // State for password mismatch animation
  const [passwordError, setPasswordError] = useState(false);
  // State for the error popup message
  const [errorMessage, setErrorMessage] = useState("");

  // --- SUPABASE CLIENT ---
  const supabase = createClient();

  // --- GOOGLE SIGN-IN HANDLER ---
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/profile`,
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error.message);
      setErrorMessage("Failed to sign in with Google.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // --- SLIDESHOW COMPONENT ---
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

  // --- FORM SUBMISSION HANDLER ---
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Clear previous errors
    setPasswordError(false);
    setErrorMessage("");

    if (isLogin) {
      // Handle login logic
      alert(`Logging in with:\nEmail: ${email}`);
    } else {
      // Handle sign-up logic
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match!");
        setPasswordError(true);
        setTimeout(() => setPasswordError(false), 600); // Reset animation class
        setTimeout(() => setErrorMessage(""), 3000); // Hide popup
        return;
      }
      if (!agree) {
        setErrorMessage("Please agree to the Terms & Conditions.");
        setTimeout(() => setErrorMessage(""), 3000); // Hide popup
        return;
      }
      alert(
        `Account created for:\nFirst Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}`
      );
    }
  }

  // --- FORM TOGGLE FUNCTION ---
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setPasswordError(false); // Reset errors when toggling
    setErrorMessage("");
  };

  // --- DYNAMIC CLASS FOR PASSWORD INPUTS ---
  const passwordInputClass = `
    w-full rounded-[20px] border bg-gray-50 p-3 text-gray-800 placeholder-gray-400 transition focus:outline-none focus:ring-1
    ${passwordError
      ? 'border-red-500 ring-red-500 animate-shake'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
  `;

  return (
    <>
      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes slide-down-fade-in {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-popup {
          animation: slide-down-fade-in 0.4s ease-out forwards;
        }
      `}</style>

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 -z-10 h-screen w-screen min-h-full min-w-full object-cover"
      >
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Main Container */}
      <div className="fixed top-1/2 left-1/2 flex w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white/60 shadow-lg backdrop-blur-sm md:max-w-4xl md:h-[80vh]">
        
        {/* Error Popup */}
        {errorMessage && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 px-6 py-2 bg-red-600 text-white font-semibold rounded-full shadow-lg animate-popup">
            {errorMessage}
          </div>
        )}

        {/* Left-side intro text */}
        <div className="relative hidden w-2/5 flex-col items-center justify-end p-8 text-white md:flex">
          <Slideshow />
          <div className="relative z-10 text-center">
            <h1 className="mb-2 font-serif text-4xl font-bold">
              {isLogin ? "Welcome Back!" : "Create your Account"}
            </h1>
            <p>
              {isLogin
                ? "Log in to continue where you left off."
                : "Sign up to unlock all features and stay connected."}
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white p-6 md:w-3/5 md:p-8 overflow-y-auto"
        >
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            {isLogin ? "Log In" : "Sign Up"}
          </h1>
          <p className="mb-6 text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleForm}
              className="text-blue-600 hover:underline font-semibold"
            >
              {isLogin ? "Sign Up" : "Log in"}
            </button>
          </p>
          
          {/* Sign-up specific fields */}
          {!isLogin && (
            <div className="flex flex-col gap-4 md:flex-row">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name *"
                required
                className="w-full rounded-[20px] border border-gray-300 bg-gray-50 p-3 text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name *"
                required
                className="w-full rounded-[20px] border border-gray-300 bg-gray-50 p-3 text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Email */}
          <div className="mt-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email *"
              required
              className="w-full rounded-[20px] border border-gray-300 bg-gray-50 p-3 text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="relative mt-4">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password *"
              required
              className={passwordInputClass}
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          {/* Confirm Password (only on sign-up) */}
          {!isLogin && (
            <div className="relative mt-4">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password *"
                required
                className={passwordInputClass}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          )}

          {/* Terms & Conditions (only on sign-up) */}
          {!isLogin && (
            <label className="mt-4 flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms & Conditions
                </a>
              </p>
            </label>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-gradient-to-b from-blue-500 to-blue-600 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!isLogin && !agree}
          >
            {isLogin ? "Log In" : "Confirm"}
          </button>
          
          {/* Divider */}
          <div className="relative my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 flex-shrink text-sm text-gray-500">
              Or {isLogin ? "log in" : "sign up"} with
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          {/* Social login (Google only) */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex w-full max-w-xs items-center justify-center gap-2 rounded-full border border-gray-300 bg-white py-2.5 px-4 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <Image src={GoogleIcon} alt="Google Icon" height={30} />
              Google
            </button>
          </div>
        </form>
      </div>
    </>
  );
}