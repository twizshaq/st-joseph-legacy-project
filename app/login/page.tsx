"use client";

import { useState, useEffect } from "react";
import "./stylesheet.css";
import { FaEye, FaEyeSlash, FaGoogle, FaApple } from "react-icons/fa";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const images = ["/pic1.jpg", "/pic2.jpg", "/pic3.jpg"];

  function Slideshow() {
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
      <div className="slideshow">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            className={`slide-image ${index === currentIndex ? "active" : ""}`}
          />
        ))}
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert(`Email: ${email}`);
  }

  return (
    <>
      <video autoPlay loop muted playsInline className="background-video">
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="form-container">
        {/* Left-side intro text with slideshow */}
        <div className="left-intro">
          <Slideshow />
          <div className="intro-text">
            <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Welcome Back</h1>
            <p>Connect with your world in one click.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="sign-up-form">
          <h1 className="form-title">Login</h1>
          <p className="form-subtitle">
            Don't have an account?{" "}
            <a href="/sign-up" style={{ color: "#007BFF" }}>Sign up</a>
          </p>

          {/* Email */}
          <div className="form-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="form-row-in"
            />
          </div>

          {/* Password */}
          <div className="form-row password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="form-row-in"
            />
            <button
              type="button"
              className="toggle-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Submit */}
          <button type="submit" className="submitbutton">
            Confirm
          </button>

          {/* Social login */}
          <div className="social-login">
            <span className="social-login-text">Or login with</span>
            <div className="social-btns">
              <button type="button" className="google-btn">
                <FaGoogle size={18} color="#4285F4" style={{ marginRight: "10px" }} />
                Google
              </button>
              <button type="button" className="apple-btn">
                <FaApple size={18} color="#000" style={{ marginRight: "10px" }} />
                Apple
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

