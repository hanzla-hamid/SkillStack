"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Check, Globe } from "lucide-react";

export interface Country {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
}

const COUNTRIES: Country[] = [
  { name: "Pakistan", code: "PK", flag: "🇵🇰", dialCode: "+92" },
  { name: "India", code: "IN", flag: "🇮🇳", dialCode: "+91" },
  { name: "United States", code: "US", flag: "🇺🇸", dialCode: "+1" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧", dialCode: "+44" },
  { name: "Canada", code: "CA", flag: "🇨🇦", dialCode: "+1" },
  { name: "Australia", code: "AU", flag: "🇦🇺", dialCode: "+61" },
  { name: "Germany", code: "DE", flag: "🇩🇪", dialCode: "+49" },
  { name: "France", code: "FR", flag: "🇫🇷", dialCode: "+33" },
  { name: "Spain", code: "ES", flag: "🇪🇸", dialCode: "+34" },
  { name: "Italy", code: "IT", flag: "🇮🇹", dialCode: "+39" },
  { name: "Netherlands", code: "NL", flag: "🇳🇱", dialCode: "+31" },
  { name: "Sweden", code: "SE", flag: "🇸🇪", dialCode: "+46" },
  { name: "Norway", code: "NO", flag: "🇳🇴", dialCode: "+47" },
  { name: "Denmark", code: "DK", flag: "🇩🇰", dialCode: "+45" },
  { name: "Finland", code: "FI", flag: "🇫🇮", dialCode: "+358" },
  { name: "Switzerland", code: "CH", flag: "🇨🇭", dialCode: "+41" },
  { name: "Austria", code: "AT", flag: "🇦🇹", dialCode: "+43" },
  { name: "Belgium", code: "BE", flag: "🇧🇪", dialCode: "+32" },
  { name: "Ireland", code: "IE", flag: "🇮🇪", dialCode: "+353" },
  { name: "Portugal", code: "PT", flag: "🇵🇹", dialCode: "+351" },
  { name: "Greece", code: "GR", flag: "🇬🇷", dialCode: "+30" },
  { name: "Poland", code: "PL", flag: "🇵🇱", dialCode: "+48" },
  { name: "Czech Republic", code: "CZ", flag: "🇨🇿", dialCode: "+420" },
  { name: "Romania", code: "RO", flag: "🇷🇴", dialCode: "+40" },
  { name: "Hungary", code: "HU", flag: "🇭🇺", dialCode: "+36" },
  { name: "Bulgaria", code: "BG", flag: "🇧🇬", dialCode: "+359" },
  { name: "Croatia", code: "HR", flag: "🇭🇷", dialCode: "+385" },
  { name: "Serbia", code: "RS", flag: "🇷🇸", dialCode: "+381" },
  { name: "Slovakia", code: "SK", flag: "🇸🇰", dialCode: "+421" },
  { name: "Slovenia", code: "SI", flag: "🇸🇮", dialCode: "+386" },
  { name: "Lithuania", code: "LT", flag: "🇱🇹", dialCode: "+370" },
  { name: "Latvia", code: "LV", flag: "🇱🇻", dialCode: "+371" },
  { name: "Estonia", code: "EE", flag: "🇪🇪", dialCode: "+372" },
  { name: "Russia", code: "RU", flag: "🇷🇺", dialCode: "+7" },
  { name: "Ukraine", code: "UA", flag: "🇺🇦", dialCode: "+380" },
  { name: "Belarus", code: "BY", flag: "🇧🇾", dialCode: "+375" },
  { name: "Turkey", code: "TR", flag: "🇹🇷", dialCode: "+90" },
  { name: "China", code: "CN", flag: "🇨🇳", dialCode: "+86" },
  { name: "Japan", code: "JP", flag: "🇯🇵", dialCode: "+81" },
  { name: "South Korea", code: "KR", flag: "🇰🇷", dialCode: "+82" },
  { name: "Singapore", code: "SG", flag: "🇸🇬", dialCode: "+65" },
  { name: "Malaysia", code: "MY", flag: "🇲🇾", dialCode: "+60" },
  { name: "Indonesia", code: "ID", flag: "🇮🇩", dialCode: "+62" },
  { name: "Thailand", code: "TH", flag: "🇹🇭", dialCode: "+66" },
  { name: "Vietnam", code: "VN", flag: "🇻🇳", dialCode: "+84" },
  { name: "Philippines", code: "PH", flag: "🇵🇭", dialCode: "+63" },
  { name: "Bangladesh", code: "BD", flag: "🇧🇩", dialCode: "+880" },
  { name: "Sri Lanka", code: "LK", flag: "🇱🇰", dialCode: "+94" },
  { name: "Nepal", code: "NP", flag: "🇳🇵", dialCode: "+977" },
  { name: "Afghanistan", code: "AF", flag: "🇦🇫", dialCode: "+93" },
  { name: "Iran", code: "IR", flag: "🇮🇷", dialCode: "+98" },
  { name: "Iraq", code: "IQ", flag: "🇮🇶", dialCode: "+964" },
  { name: "Saudi Arabia", code: "SA", flag: "🇸🇦", dialCode: "+966" },
  { name: "UAE", code: "AE", flag: "🇦🇪", dialCode: "+971" },
  { name: "Qatar", code: "QA", flag: "🇶🇦", dialCode: "+974" },
  { name: "Kuwait", code: "KW", flag: "🇰🇼", dialCode: "+965" },
  { name: "Bahrain", code: "BH", flag: "🇧🇭", dialCode: "+973" },
  { name: "Oman", code: "OM", flag: "🇴🇲", dialCode: "+968" },
  { name: "Jordan", code: "JO", flag: "🇯🇴", dialCode: "+962" },
  { name: "Lebanon", code: "LB", flag: "🇱🇧", dialCode: "+961" },
  { name: "Egypt", code: "EG", flag: "🇪🇬", dialCode: "+20" },
  { name: "Morocco", code: "MA", flag: "🇲🇦", dialCode: "+212" },
  { name: "Nigeria", code: "NG", flag: "🇳🇬", dialCode: "+234" },
  { name: "South Africa", code: "ZA", flag: "🇿🇦", dialCode: "+27" },
  { name: "Kenya", code: "KE", flag: "🇰🇪", dialCode: "+254" },
  { name: "Ethiopia", code: "ET", flag: "🇪🇹", dialCode: "+251" },
  { name: "Ghana", code: "GH", flag: "🇬🇭", dialCode: "+233" },
  { name: "Algeria", code: "DZ", flag: "🇩🇿", dialCode: "+213" },
  { name: "Tunisia", code: "TN", flag: "🇹🇳", dialCode: "+216" },
  { name: "Libya", code: "LY", flag: "🇱🇾", dialCode: "+218" },
  { name: "Sudan", code: "SD", flag: "🇸🇩", dialCode: "+249" },
  { name: "Tanzania", code: "TZ", flag: "🇹🇿", dialCode: "+255" },
  { name: "Uganda", code: "UG", flag: "🇺🇬", dialCode: "+256" },
  { name: "Brazil", code: "BR", flag: "🇧🇷", dialCode: "+55" },
  { name: "Argentina", code: "AR", flag: "🇦🇷", dialCode: "+54" },
  { name: "Mexico", code: "MX", flag: "🇲🇽", dialCode: "+52" },
  { name: "Chile", code: "CL", flag: "🇨🇱", dialCode: "+56" },
  { name: "Colombia", code: "CO", flag: "🇨🇴", dialCode: "+57" },
  { name: "Peru", code: "PE", flag: "🇵🇪", dialCode: "+51" },
  { name: "Venezuela", code: "VE", flag: "🇻🇪", dialCode: "+58" },
  { name: "Ecuador", code: "EC", flag: "🇪🇨", dialCode: "+593" },
  { name: "Bolivia", code: "BO", flag: "🇧🇴", dialCode: "+591" },
  { name: "Paraguay", code: "PY", flag: "🇵🇾", dialCode: "+595" },
  { name: "Uruguay", code: "UY", flag: "🇺🇾", dialCode: "+598" },
  { name: "New Zealand", code: "NZ", flag: "🇳🇿", dialCode: "+64" },
  { name: "Israel", code: "IL", flag: "🇮🇱", dialCode: "+972" },
  { name: "Iceland", code: "IS", flag: "🇮🇸", dialCode: "+354" },
  { name: "Luxembourg", code: "LU", flag: "🇱🇺", dialCode: "+352" },
  { name: "Malta", code: "MT", flag: "🇲🇹", dialCode: "+356" },
  { name: "Cyprus", code: "CY", flag: "🇨🇾", dialCode: "+357" },
  { name: "Hong Kong", code: "HK", flag: "🇭🇰", dialCode: "+852" },
  { name: "Taiwan", code: "TW", flag: "🇹🇼", dialCode: "+886" },
  { name: "Kazakhstan", code: "KZ", flag: "🇰🇿", dialCode: "+7" },
  { name: "Uzbekistan", code: "UZ", flag: "🇺🇿", dialCode: "+998" },
  { name: "Azerbaijan", code: "AZ", flag: "🇦🇿", dialCode: "+994" },
  { name: "Armenia", code: "AM", flag: "🇦🇲", dialCode: "+374" },
  { name: "Georgia", code: "GE", flag: "🇬🇪", dialCode: "+995" },
  { name: "Moldova", code: "MD", flag: "🇲🇩", dialCode: "+373" },
  { name: "Montenegro", code: "ME", flag: "🇲🇪", dialCode: "+382" },
  { name: "Bosnia", code: "BA", flag: "🇧🇦", dialCode: "+387" },
  { name: "Albania", code: "AL", flag: "🇦🇱", dialCode: "+355" },
  { name: "North Macedonia", code: "MK", flag: "🇲🇰", dialCode: "+389" },
  { name: "Cambodia", code: "KH", flag: "🇰🇭", dialCode: "+855" },
  { name: "Myanmar", code: "MM", flag: "🇲🇲", dialCode: "+95" },
  { name: "Laos", code: "LA", flag: "🇱🇦", dialCode: "+856" },
  { name: "Mongolia", code: "MN", flag: "🇲🇳", dialCode: "+976" },
  { name: "Nigeria", code: "NG2", flag: "🇳🇬", dialCode: "+234" },
  { name: "Senegal", code: "SN", flag: "🇸🇳", dialCode: "+221" },
  { name: "Cameroon", code: "CM", flag: "🇨🇲", dialCode: "+237" },
  { name: "Ivory Coast", code: "CI", flag: "🇨🇮", dialCode: "+225" },
  { name: "Zimbabwe", code: "ZW", flag: "🇿🇼", dialCode: "+263" },
  { name: "Rwanda", code: "RW", flag: "🇷🇼", dialCode: "+250" },
  { name: "Other", code: "OTHER", flag: "🌍", dialCode: "" },
];

interface CountrySelectProps {
  value: string;
  onChange: (country: string) => void;
  required?: boolean;
}

export function CountrySelect({ value, onChange, required }: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => COUNTRIES.find((c) => c.name === value),
    [value],
  );

  const filtered = useMemo(() => {
    if (!search) return COUNTRIES;
    const q = search.toLowerCase();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.dialCode.includes(q),
    );
  }, [search]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchRef.current?.focus(), 100);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
        Country {required && "*"}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] py-2.5 pl-4 pr-10 text-sm text-[var(--color-text-primary)] transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
      >
        <span className="text-xl">{selected ? selected.flag : <Globe className="h-4 w-4 text-[var(--color-text-muted)]" />}</span>
        <span className={selected ? "" : "text-[var(--color-text-muted)]"}>
          {selected ? selected.name : "Select your country"}
        </span>
        {selected && selected.dialCode && (
          <span className="ml-auto text-xs text-[var(--color-text-muted)]">
            {selected.dialCode}
          </span>
        )}
        <ChevronDown
          className={`absolute right-3 h-4 w-4 text-[var(--color-text-muted)] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-[var(--color-border-default)] glass-strong shadow-card"
          >
            <div className="border-b border-[var(--color-border-default)] p-2">
              <div className="flex items-center gap-2 rounded-lg bg-[var(--color-surface)] px-3 py-2">
                <Search className="h-4 w-4 text-[var(--color-text-muted)]" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search countries..."
                  className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <p className="px-3 py-4 text-center text-sm text-[var(--color-text-muted)]">
                  No countries found
                </p>
              ) : (
                filtered.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      onChange(country.name);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-gold/5 ${
                      country.name === value ? "bg-gold/10 text-gold" : "text-[var(--color-text-primary)]"
                    }`}
                  >
                    <span className="text-xl">{country.flag}</span>
                    <span className="flex-1">{country.name}</span>
                    {country.dialCode && (
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {country.dialCode}
                      </span>
                    )}
                    {country.name === value && (
                      <Check className="h-4 w-4 text-gold" />
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
