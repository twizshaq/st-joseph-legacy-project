import { CheckCircle2 } from "lucide-react";
import type { WaitlistFormModel } from "@/app/components/home/landing/home.types";

type WaitlistSignupFormProps = {
  waitlist: WaitlistFormModel;
};

export default function WaitlistSignupForm({ waitlist }: WaitlistSignupFormProps) {
  const { email, isSubmitting, submissionMessage, isValidEmail, setEmail, handleSubmit } = waitlist;

  return (
    <form onSubmit={handleSubmit} className="mt-8 w-full max-w-[560px]">
      <div className="relative flex items-center justify-end rounded-full border-[3px] border-white bg-white/40 p-[3px] shadow-[0px_0px_40px_rgba(31,63,122,0.15)] transition-shadow hover:shadow-[0px_0px_40px_rgba(31,63,122,0.2)]">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="off"
          placeholder="Enter your email"
          disabled={isSubmitting}
          className="w-full rounded-full bg-transparent py-4 pl-4 pr-[126px] text-base font-semibold text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-70"
        />
        <button
          type="submit"
          disabled={!isValidEmail || isSubmitting}
          className={`absolute mr-[3px] flex rounded-full px-[22px] py-[13px] font-semibold transition-all duration-300 active:scale-[.97]
            ${isSubmitting
              ? "bg-transparent"
              : isValidEmail
                ? "cursor-pointer bg-[#007BFF] text-white shadow-[0_4px_14px_rgba(0,123,255,0.4)] hover:bg-[#0056b3]"
                : "bg-[#777]/20 text-slate-400"
            }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Saving
            </span>
          ) : (
            "Notify Me"
          )}
        </button>
      </div>

      <div className="mt-3 min-h-[24px]">
        {submissionMessage && (
          <div
            className={`animate-in fade-in slide-in-from-top-1 flex items-center justify-center gap-2 text-sm font-semibold ${
              submissionMessage.includes("You’re in!") || submissionMessage.includes("already")
                ? "text-[#007BFF]"
                : "text-red-500"
            }`}
          >
            {submissionMessage.includes("You’re in!") && <CheckCircle2 className="h-4 w-4" />}
            {submissionMessage}
          </div>
        )}
      </div>
    </form>
  );
}
