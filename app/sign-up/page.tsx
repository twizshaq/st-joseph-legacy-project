"use client";

import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaGoogle, FaApple } from "react-icons/fa";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  // Slideshow component with Tailwind classes
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

  // Form submission handler
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!agree) {
      alert("Please agree to the Terms & Conditions.");
      return;
    }
    alert(
      `Account created for:\nFirst Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}`
    );
  }

  return (
    <>
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
        
        {/* Left-side intro text with slideshow (hidden on mobile) */}
        <div className="relative hidden w-2/5 flex-col items-center justify-end p-8 text-white md:flex">
          <Slideshow />
          <div className="relative z-10 text-center">
            <h1 className="mb-2 font-serif text-4xl font-bold">
              Create your Account
            </h1>
            <p>Sign up to unlock all features and stay connected.</p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white p-6 md:w-3/5 md:p-8 overflow-y-auto"
        >
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Sign Up</h1>
          <p className="mb-6 text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Log in
            </a>
          </p>

          {/* First & Last Name */}
          <div className="flex flex-col gap-4 md:flex-row">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              required
              className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              required
              className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="mt-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="relative mt-4">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative mt-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          {/* Terms & Conditions */}
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

          {/* Submit */}
          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-gradient-to-b from-blue-500 to-blue-600 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!agree}
          >
            Confirm
          </button>
          
          {/* Divider */}
          <div className="relative my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 flex-shrink text-sm text-gray-500">
              Or sign up with
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          {/* Social login */}
          <div className="flex flex-col gap-4 md:flex-row">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-2.5 px-4 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <FaGoogle size={18} className="text-[#4285F4]" />
              Google
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-2.5 px-4 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <FaApple size={18} />
              Apple
            </button>
          </div>
        </form>
      </div>
    </>
  );
}