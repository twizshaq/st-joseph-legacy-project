"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { SurveyFormModel, SurveyChoice } from "@/app/components/home/landing/home.types";

export const useHomeSurveyForm = (): SurveyFormModel => {
  const [favoriteSite, setFavoriteSite] = useState("");
  const [hasFamilyEmergencyPlan, setHasFamilyEmergencyPlan] = useState<SurveyChoice>(null);
  const [knowsEmergencyNumbers, setKnowsEmergencyNumbers] = useState<SurveyChoice>(null);
  const [isSurveySubmitting, setIsSurveySubmitting] = useState(false);
  const [surveySuccessMessage, setSurveySuccessMessage] = useState("");
  const [surveyErrorMessage, setSurveyErrorMessage] = useState("");
  const [isFavoriteSiteMenuOpen, setIsFavoriteSiteMenuOpen] = useState(false);
  const favoriteSiteMenuRef = useRef<HTMLDivElement | null>(null);

  const isSurveyReadyToSubmit = useMemo(
    () => favoriteSite.trim() !== "" && hasFamilyEmergencyPlan !== null && knowsEmergencyNumbers !== null,
    [favoriteSite, hasFamilyEmergencyPlan, knowsEmergencyNumbers]
  );

  useEffect(() => {
    if (!isFavoriteSiteMenuOpen) {
      return;
    }

    const handlePointerDownOutside = (event: MouseEvent | TouchEvent) => {
      if (!favoriteSiteMenuRef.current?.contains(event.target as Node)) {
        setIsFavoriteSiteMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFavoriteSiteMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDownOutside);
    document.addEventListener("touchstart", handlePointerDownOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDownOutside);
      document.removeEventListener("touchstart", handlePointerDownOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isFavoriteSiteMenuOpen]);

  const handleSurveySubmit: SurveyFormModel["handleSurveySubmit"] = async (event) => {
    event.preventDefault();

    if (!isSurveyReadyToSubmit || isSurveySubmitting) {
      return;
    }

    setIsSurveySubmitting(true);
    setSurveySuccessMessage("");
    setSurveyErrorMessage("");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      setSurveyErrorMessage("Configuration error. Please try again later.");
      setIsSurveySubmitting(false);
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    try {
      const { error } = await supabase.from("home_site_quiz_responses").insert({
        favorite_site: favoriteSite,
        has_family_emergency_plan: hasFamilyEmergencyPlan,
        knows_barbados_emergency_numbers: knowsEmergencyNumbers,
      });

      if (error) {
        throw error;
      }

      setIsFavoriteSiteMenuOpen(false);
      setFavoriteSite("");
      setHasFamilyEmergencyPlan(null);
      setKnowsEmergencyNumbers(null);
      setSurveySuccessMessage("Thanks for your response");
    } catch (error) {
      console.error("Failed to save survey response:", error);
      setSurveyErrorMessage("We couldn't save your response. Please try again.");
    } finally {
      setIsSurveySubmitting(false);
    }
  };

  return {
    favoriteSite,
    hasFamilyEmergencyPlan,
    knowsEmergencyNumbers,
    isSurveySubmitting,
    surveySuccessMessage,
    surveyErrorMessage,
    isFavoriteSiteMenuOpen,
    favoriteSiteMenuRef,
    isSurveyReadyToSubmit,
    toggleFavoriteSiteMenu: () => setIsFavoriteSiteMenuOpen((isOpen) => !isOpen),
    closeFavoriteSiteMenu: () => setIsFavoriteSiteMenuOpen(false),
    selectFavoriteSite: (value) => {
      setFavoriteSite(value);
      setIsFavoriteSiteMenuOpen(false);
    },
    setHasFamilyEmergencyPlan: (value) => setHasFamilyEmergencyPlan(value),
    setKnowsEmergencyNumbers: (value) => setKnowsEmergencyNumbers(value),
    handleSurveySubmit,
  };
};
