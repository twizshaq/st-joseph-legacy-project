import type {
  FormEvent,
  PointerEventHandler,
  RefObject,
} from "react";
import type { SiteCard } from "@/app/types";

export type HeroImageStatus = "loaded" | "failed";
export type SurveyChoice = boolean | null;

export type HeroPointerState = {
  pointerId: number;
  pointerType: string;
  startX: number;
  startY: number;
  isHorizontalSwipe: boolean | null;
  lastX: number;
  lastTimestamp: number;
  velocity: number;
  velocitySamples: number[];
};

export type WaitlistFormModel = {
  email: string;
  isSubmitting: boolean;
  submissionMessage: string;
  isValidEmail: boolean;
  setEmail: (value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export type HeroCarouselModel = {
  heroViewportRef: RefObject<HTMLDivElement | null>;
  heroCards: SiteCard[];
  heroCarouselPosition: number;
  heroImageStatusById: Record<number, HeroImageStatus>;
  hasHeroCardsEntered: boolean;
  isHeroLoading: boolean;
  isHeroDragging: boolean;
  isDesktopHeroLayout: boolean;
  canNavigateHeroCards: boolean;
  handleHeroPointerDown: PointerEventHandler<HTMLDivElement>;
  handleHeroPointerMove: PointerEventHandler<HTMLDivElement>;
  handleHeroPointerUp: PointerEventHandler<HTMLDivElement>;
};

export type SurveyFormModel = {
  favoriteSite: string;
  hasFamilyEmergencyPlan: SurveyChoice;
  knowsEmergencyNumbers: SurveyChoice;
  isSurveySubmitting: boolean;
  surveySuccessMessage: string;
  surveyErrorMessage: string;
  isFavoriteSiteMenuOpen: boolean;
  favoriteSiteMenuRef: RefObject<HTMLDivElement | null>;
  isSurveyReadyToSubmit: boolean;
  toggleFavoriteSiteMenu: () => void;
  closeFavoriteSiteMenu: () => void;
  selectFavoriteSite: (value: string) => void;
  setHasFamilyEmergencyPlan: (value: boolean) => void;
  setKnowsEmergencyNumbers: (value: boolean) => void;
  handleSurveySubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};
