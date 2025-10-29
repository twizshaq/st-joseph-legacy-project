"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import the router
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import Image from "next/image";
import GoogleIcon from "@/public/icons/google-icon.svg";
import FacebookIcon from "@/public/icons/facebook-icon";
import { createClient } from "@/lib/supabase/client";

// Define the types for the component's props
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signup' | 'login';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signup' }) => {
  // --- STATE MANAGEMENT ---
  const [isLogin, setIsLogin] = useState<boolean>(initialMode === 'login');
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [agree, setAgree] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>(""); // For success popups
  const [isLoading, setIsLoading] = useState<boolean>(false); // For loading state

  const router = useRouter(); // Initialize the router
  const supabase = createClient();

  useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);

  useEffect(() => {
  if (!isOpen) return;

  // Find the scrollable form container
  const formElement = document.querySelector('form');

  const handleTouchMove = (e: TouchEvent) => {
    if (!formElement) return;

    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);

    // If touch is inside the form, allow scrolling
    if (formElement.contains(target)) {
      return; // Let the form handle the scroll
    }

    // Otherwise, prevent background scroll
    e.preventDefault();
  };

  // Lock body scroll
   const scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';

  // Add smart touchmove listener
  document.addEventListener('touchmove', handleTouchMove, { passive: false });

  return () => {
    // Restore body scroll
    const top = -parseInt(document.body.style.top || '0');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, top);

    document.removeEventListener('touchmove', handleTouchMove);
  };
}, [isOpen]);

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/profile` },
    });
    if (error) {
      setErrorMessage("Failed to sign in with Google.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // --- UPDATED SUBMIT HANDLER WITH SUPABASE AUTH ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Reset states on new submission
    setPasswordError(false);
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    // --- LOGIN LOGIC ---
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setErrorMessage(error.message);
        setTimeout(() => setErrorMessage(""), 4000);
      } else {
        // Successful login, close modal and refresh the page state
        onClose();
        router.refresh(); 
      }
    } 
    // --- SIGN UP LOGIC ---
    else {
      // Client-side validation first
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match!");
        setPasswordError(true);
        setTimeout(() => setPasswordError(false), 600);
        setTimeout(() => setErrorMessage(""), 3000);
        setIsLoading(false);
        return;
      }
      if (!agree) {
        setErrorMessage("Please agree to the Terms & Conditions.");
        setTimeout(() => setErrorMessage(""), 3000);
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          // You can store additional user data like this in the 'users' table metadata
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setTimeout(() => setErrorMessage(""), 4000);
      } else {
        // Show success message and then close the modal
        setSuccessMessage("Success! Please check your email to verify your account.");
        setTimeout(() => {
          setSuccessMessage("");
          onClose();
        }, 4000);
      }
    }
    setIsLoading(false);
  };
  
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setPasswordError(false);
    setErrorMessage("");
    setSuccessMessage("");
  };
  


  function Slideshow() {
    const images: string[] = [
      "https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/France.jpeg", 
      "https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/France.jpeg", 
      "https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/France.jpeg"
    ];

    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
      }, 3000);
      return () => clearInterval(interval);
    }, [images.length]);

    return (
      <div className="absolute inset-0 h-full w-full overflow-hidden rounded-l-xl">
        {images.map((imgSrc, index) => (
          <Image
            key={index}
            src={imgSrc} // Use the string URL directly
            alt="Decorative slideshow"
            fill
            priority={index === 0} // Still prioritize the first image for faster load
            sizes="(max-width: 768px) 0vw, 40vw" // Adjust if needed
            className={`
              object-cover 
              transition-opacity 
              duration-1000 
              ease-in-out 
              will-change-opacity 
              ${index === currentIndex ? "opacity-100" : "opacity-0"}
            `}
          />
        ))}
      </div>
    );
  }


  if (!isOpen) return null;

  const passwordInputClass = `w-full font-[500] rounded-[20px] border-[2px] border-gray-300/10 bg-[#999]/10 p-3 text-white placeholder-white/80 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${passwordError ? 'border-red-500 ring-red-500 animate-shake' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`;

  const isSignupFormComplete = 
  firstName && lastName && email && password && confirmPassword && agree;

  return (
    <>
      <div className='fixed top-[0px] bg-white/1 h-[50px] w-full z-[200] z-[-20]' />
      <div className='fixed bottom-[0px] bg-white/1 z-[200] h-[50px] w-full z-[-20]' />

      <div onClick={onClose} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-[15px]">
        {/* Error Popup */}
        {errorMessage && (
          <div className="absolute text-center top-5 left-[50%] z-[120] px-6 py-2 bg-red-600 text-white font-semibold rounded-full animate-popup">
            {errorMessage}
          </div>
        )}
        {/* Success Popup */}
        {successMessage && (
          <div className="absolute text-center top-5 z-[120] left-[50%] px-6 py-2 bg-green-600 text-white font-semibold rounded-full animate-popup">
            {successMessage}
          </div>
        )}

        <div className='fixed left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[43px] p-[5px] z-[50]'>
          <div className='bg-white/10 max-sm:backdrop-blur-[0px] backdrop-blur-[40px] rounded-[43px] p-[3px] shadow-[0px_0px_30px_rgba(0,0,0,.5)]'>
            <div onClick={(e) => e.stopPropagation()} className="max-h-[90dvh] relative flex w-[95vw] max-w-md overflow-y-auto rounded-[40px] bg-black/65 md:max-w-4xl touch-none">
              <button onClick={onClose} className="cursor-pointer absolute top-6 right-6 z-20 text-white hover:text-red-500 active:text-red-500 transition-colors">
                <FaTimes size={24} />
              </button>
              <div className="relative hidden w-2/5 flex-col items-center justify-end p-8 text-white md:flex">
                <Slideshow />
                <div className="relative z-10 text-center bg-red-500/0 text-wrap w-[300px]">
                  <h1 className="mb-2 font-serif text-4xl font-bold">{isLogin ? "Welcome Back!" : "Create your Account"}</h1>
                  <p>{isLogin ? "Log in to continue where you left off." : "Sign up to unlock all features and stay connected."}</p>
                </div>
              </div>
              
              <form
                onSubmit={handleSubmit}
                className="w-full bg-white/0 p-6 md:w-3/5 md:p-8 max-h-[90dvh] overflow-y-auto"
                >
                <h1 className="mb-2 text-3xl font-bold text-white">{isLogin ? "Log In" : "Sign Up"}</h1>
                <p className="mb-6 text-sm text-white/70">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button type="button" onClick={toggleForm} className="text-[#66B2FF] hover:underline font-semibold">
                    {isLogin ? "Sign Up" : "Log in"}
                  </button>
                </p>
                
                {!isLogin && (
                  <div className="flex flex-col gap-4 md:flex-row">
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name *" required className="w-full font-[500] rounded-[20px] border-[2px] border-gray-300/10 bg-[#999]/10 p-3 text-white placeholder-white/80 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name *" required className="w-full font-[500] rounded-[20px] border-[2px] border-gray-300/10 bg-[#999]/10 p-3 text-white placeholder-white/80 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                )}
                
                <div className="mt-4">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email *" required className="w-full font-[500] rounded-[20px] border-[2px] border-gray-300/10 bg-[#999]/10 p-3 text-white placeholder-white/80 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                
                <div className="relative mt-4">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password *" required className={passwordInputClass} />
                  <button type="button" className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
                
                {!isLogin && (
                  <div className="relative mt-4">
                    <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password *" required className={passwordInputClass} />
                    <button type="button" className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>
                )}

                {!isLogin && (
                  <label className="mt-4 flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 font-[500]" />
                    <p className="text-sm text-white">I agree to the <a href="/terms" className="text-[#66B2FF] hover:underline font-[500]">Terms & Conditions *</a></p>
                  </label>
                )}

                <button 
                  type="submit" 
                  className="mt-6 w-full rounded-full bg-[#007BFF] py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50" 
                  disabled={
                    isLoading || 
                    (isLogin 
                      ? !email || !password // Disable if login fields are empty
                      : !isSignupFormComplete // Disable if signup form is incomplete
                    )
                  }
                >
                  {isLoading ? 'Loading...' : (isLogin ? "Log In" : "Create Account")}
                </button>
                
                <div className="relative my-6 flex items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 flex-shrink text-sm text-white">Or {isLogin ? "log in" : "sign up"} with</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                
                <div className="flex justify-center gap-[20px]">
                  <button type="button" onClick={handleGoogleSignIn} className="cursor-pointer flex w-full max-w-xs items-center justify-center gap-2 rounded-full border border-gray-300 bg-white py-2.5 px-4 font-semibold text-gray-700 transition hover:bg-gray-50">
                    <Image src={GoogleIcon} alt="Google Icon" height={30} />
                    Google
                  </button>
                  <button type="button" onClick={handleGoogleSignIn} className="cursor-pointer flex w-full max-w-xs items-center justify-center gap-2 rounded-full border border-gray-300 bg-white py-2.5 px-4 font-semibold text-gray-700 transition hover:bg-gray-50">
                    <FacebookIcon color="#0866FF" height={25} width={25} />
                    Facebook
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;