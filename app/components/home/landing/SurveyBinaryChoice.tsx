import type { SurveyChoice } from "@/app/components/home/landing/home.types";

type SurveyBinaryChoiceProps = {
  label: string;
  selected: SurveyChoice;
  disabled: boolean;
  onChange: (value: boolean) => void;
};

export default function SurveyBinaryChoice({
  label,
  selected,
  disabled,
  onChange,
}: SurveyBinaryChoiceProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-bold text-slate-800">{label}</p>
      <div className="grid grid-cols-2 gap-3">
        {[true, false].map((choice) => {
          const isSelected = selected === choice;

          return (
            <button
              key={`${label}-${String(choice)}`}
              type="button"
              onClick={() => onChange(choice)}
              disabled={disabled}
              className={`rounded-[20px] border px-4 py-3 text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-70 ${
                isSelected
                  ? "border-[#007BFF] bg-[#007BFF] text-white shadow-[0_12px_28px_rgba(0,123,255,0.22)]"
                  : "border-[2px] border-gray-300/50 bg-white text-slate-700 hover:bg-gray-100"
              }`}
            >
              {choice ? "Yes" : "No"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
