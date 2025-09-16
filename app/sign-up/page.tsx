"use client";

import { useState, useEffect } from "react";
import "./stylesheet.css";
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

  const images = ["/pic1.jpg", "/pic2.jpg", "/pic3.jpg"];

  // Slideshow component
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
      `First Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}`
    );
  }

  return (
    <>
      <video autoPlay loop muted playsInline className="background-video">
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="form-container">
        {/* Left-side intro text with slideshow behind */}
        <div className="left-intro">
          <Slideshow />
          <div className="intro-text">
            <h1 style={{fontSize: "2.5em", fontWeight: "bolder", fontFamily: "'Times New Roman', Times, serif", top: "210px" }}>Create your Account</h1>
            <p>Sign up to unlock all features and stay connected.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="sign-up-form">
          <h1 className="form-title">Sign Up</h1>
          <p className="form-subtitle">
            Already have an account?{" "}
            <a style={{ color: "#007BFF", textDecoration: "none" }} href="/login">Log in</a>
          </p>

          {/* First & Last Name */}
          <div className="form-row">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="form-row-in"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="form-row-in"
            />
          </div>

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

          {/* Confirm Password */}
          <div className="form-row password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="form-row-in"
            />
            <button
              type="button"
              className="toggle-eye"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Terms & Conditions */}
          <label className="checkbox">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            <p>
              I agree to the{" "}
              <a href="/terms">Terms & Conditions</a>
            </p>
          </label>

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
