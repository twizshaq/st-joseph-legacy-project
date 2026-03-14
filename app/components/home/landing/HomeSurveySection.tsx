import Image from "next/image";
import loadingIcon from "@/public/loading-icon.png";
import {
  HOME_SITE_SURVEY_OPTIONS,
  SURVEY_SPONSOR_IMAGE_URL,
} from "@/app/components/home/landing/home.constants";
import type { SurveyFormModel } from "@/app/components/home/landing/home.types";
import FavoriteSiteDropdown from "@/app/components/home/landing/FavoriteSiteDropdown";
import SurveyBinaryChoice from "@/app/components/home/landing/SurveyBinaryChoice";

type HomeSurveySectionProps = {
  survey: SurveyFormModel;
};

export default function HomeSurveySection({ survey }: HomeSurveySectionProps) {
  const {
    favoriteSite,
    hasFamilyEmergencyPlan,
    knowsEmergencyNumbers,
    isSurveySubmitting,
    surveySuccessMessage,
    surveyErrorMessage,
    isFavoriteSiteMenuOpen,
    favoriteSiteMenuRef,
    isSurveyReadyToSubmit,
    toggleFavoriteSiteMenu,
    closeFavoriteSiteMenu,
    selectFavoriteSite,
    setHasFamilyEmergencyPlan,
    setKnowsEmergencyNumbers,
    handleSurveySubmit,
  } = survey;

  return (
    <div className="mt-20 w-full max-w-[920px] self-center px-2 sm:px-0">
      <div className="mx-auto max-w-[760px]">
        <div className="text-center">
          <div className="flex flex-col-reverse justify-center gap-[15px]">
            <p className="text-[0.75rem] font-black uppercase tracking-[0.28em] text-[#007BFF]/80">
              Quick Survey
            </p>
            <Image
              src={SURVEY_SPONSOR_IMAGE_URL}
              alt="Sponsor"
              width={10}
              height={10}
              priority
              unoptimized
              draggable={false}
              className="h-[50px] w-auto max-w-none object-contain opacity-80 transition-opacity duration-300 hover:opacity-100"
            />
          </div>
          <h2 className="mt-3 text-[1.7rem] font-bold leading-tight text-slate-900 sm:text-[2.2rem]">
            Help shape the St. Joseph experience
          </h2>
          <p className="mx-auto mt-3 max-w-[640px] text-sm font-medium leading-6 text-slate-600 sm:text-[1rem]">
            Tell us your favorite place to visit in St. Joseph and how prepared your household feels for emergencies.
          </p>
        </div>

        <form onSubmit={handleSurveySubmit} className="mt-8 flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <label htmlFor="favorite-site" className="text-sm font-bold text-slate-800">
              Name your favorite place to visit in St. Joseph
            </label>
            <div className="relative z-20" ref={favoriteSiteMenuRef}>
              <FavoriteSiteDropdown
                id="favorite-site"
                value={favoriteSite}
                options={HOME_SITE_SURVEY_OPTIONS}
                isOpen={isFavoriteSiteMenuOpen}
                disabled={isSurveySubmitting}
                onToggle={toggleFavoriteSiteMenu}
                onClose={closeFavoriteSiteMenu}
                onSelect={selectFavoriteSite}
              />
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <SurveyBinaryChoice
              label="Do you have a family emergency plan?"
              selected={hasFamilyEmergencyPlan}
              disabled={isSurveySubmitting}
              onChange={setHasFamilyEmergencyPlan}
            />
            <SurveyBinaryChoice
              label="Do you know the emergency numbers of Barbados?"
              selected={knowsEmergencyNumbers}
              disabled={isSurveySubmitting}
              onChange={setKnowsEmergencyNumbers}
            />
          </div>

          <div className="mt-5 flex flex-col items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!isSurveyReadyToSubmit || isSurveySubmitting}
              className={`relative inline-flex min-w-[220px] items-center justify-center rounded-full p-[2.7px] font-semibold transition-all duration-150 ${
                !isSurveyReadyToSubmit || isSurveySubmitting
                  ? isSurveySubmitting
                    ? "bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.15)]"
                    : "bg-[#666] opacity-[.2]"
                  : "cursor-pointer bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-[0.98]"
              }`}
            >
              <span
                className={`flex w-full items-center justify-center rounded-full px-7 py-4 ${
                  !isSurveyReadyToSubmit || isSurveySubmitting
                    ? isSurveySubmitting
                      ? "bg-[linear-gradient(to_left,#007BFF,#66B2FF)] text-white"
                      : "bg-[#666] text-white"
                    : "bg-[linear-gradient(to_left,#007BFF,#66B2FF)] text-white"
                }`}
              >
                {isSurveySubmitting && (
                  <div className="absolute inset-0 flex items-center justify-end pr-[13px]">
                    <Image src={loadingIcon} alt="Loading..." className="animation" width={26} height={26} />
                  </div>
                )}
                <span>{isSurveySubmitting ? "Saving..." : "Submit response"}</span>
              </span>
            </button>

            <div className="min-h-[24px] text-center text-sm font-semibold">
              {surveySuccessMessage ? (
                <p className="text-[#007BFF]">{surveySuccessMessage}</p>
              ) : surveyErrorMessage ? (
                <p className="text-red-500">{surveyErrorMessage}</p>
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
