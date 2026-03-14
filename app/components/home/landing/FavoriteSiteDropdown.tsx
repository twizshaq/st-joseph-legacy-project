type FavoriteSiteDropdownProps = {
  id: string;
  value: string;
  options: readonly string[];
  isOpen: boolean;
  disabled: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelect: (value: string) => void;
};

export default function FavoriteSiteDropdown({
  id,
  value,
  options,
  isOpen,
  disabled,
  onToggle,
  onClose,
  onSelect,
}: FavoriteSiteDropdownProps) {
  return (
    <>
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-menu`}
        onClick={onToggle}
        className={`relative flex w-full items-center justify-between rounded-[25px] border-[2px] bg-white px-5 py-2 text-left text-base font-semibold outline-none transition disabled:opacity-70 ${
          isOpen
            ? "border-blue-500 ring-1 ring-blue-500"
            : "border-gray-300/50 hover:bg-gray-50"
        }`}
      >
        <span className={value ? "text-slate-800" : "text-slate-700"}>
          {value || "Select a site"}
        </span>
        <div
          className={`pointer-events-none mr-[-10px] flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        >
          <svg width="25" height="25" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="text-slate-500">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      <div
        id={`${id}-menu`}
        role="listbox"
        aria-labelledby={id}
        className={`absolute left-0 top-[calc(100%+12px)] w-full origin-top rounded-[36px] bg-white/10 p-[3px] shadow-[0px_0px_15px_rgba(0,0,0,0.1)] backdrop-blur-[10px] transition-all duration-300 ${
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-[33px] bg-[#FCFCFC]/80">
          <div className="flex max-h-[320px] flex-col overflow-y-auto p-3 md:max-h-[280px]">
            {options.map((siteName) => {
              const isSelected = value === siteName;

              return (
                <button
                  key={siteName}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={disabled}
                  onClick={() => onSelect(siteName)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      onClose();
                    }
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-[20px] px-4 py-4 text-left text-sm font-bold transition-all duration-200 active:scale-[0.98] active:bg-[#000]/10 disabled:opacity-70 ${
                    isSelected
                      ? "text-blue-500"
                      : "text-slate-800 hover:bg-black/10"
                  }`}
                >
                  <span>{siteName}</span>
                  {isSelected ? (
                    <span className="ml-4 h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" aria-hidden="true" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
