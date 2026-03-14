"use client";

import { useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import confetti from "canvas-confetti";
import { EMAIL_PATTERN } from "@/app/components/home/landing/home.constants";
import type { WaitlistFormModel } from "@/app/components/home/landing/home.types";

const fireNotifyConfetti = () => {
  const duration = 4000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    colors: ["#FFFFFF", "#007BFF", "#66B2FF", "#D199FF"],
    startVelocity: 32,
    spread: 80,
    ticks: 90,
    gravity: 0.9,
    scalar: 1.05,
    zIndex: 120,
  };

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      window.clearInterval(interval);
      return;
    }

    const particleCount = Math.max(12, Math.round(26 * (timeLeft / duration)));

    confetti({
      ...defaults,
      particleCount,
      angle: 60,
      origin: { x: 0, y: 0.58 },
    });

    confetti({
      ...defaults,
      particleCount,
      angle: 120,
      origin: { x: 1, y: 0.58 },
    });
  }, 220);
};

export const useWaitlistForm = (): WaitlistFormModel => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");

  const isValidEmail = useMemo(() => EMAIL_PATTERN.test(email.trim()), [email]);

  const handleSubmit: WaitlistFormModel["handleSubmit"] = async (event) => {
    event.preventDefault();
    if (!isValidEmail || isSubmitting) return;

    setIsSubmitting(true);
    setSubmissionMessage("");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      setSubmissionMessage("Configuration error. Please try again later.");
      setIsSubmitting(false);
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    try {
      const { error } = await supabase.from("waitlist").insert({ email: email.trim() });
      if (error) throw error;

      fireNotifyConfetti();
      setSubmissionMessage("You’re in! We’ll let you know when we Launch.");
      setEmail("");
    } catch (error: unknown) {
      const dbError = error as { code?: string };

      if (dbError.code === "23505") {
        setSubmissionMessage("You are already on the list!");
      } else {
        setSubmissionMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    isSubmitting,
    submissionMessage,
    isValidEmail,
    setEmail,
    handleSubmit,
  };
};
