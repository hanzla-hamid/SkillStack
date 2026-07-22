"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface IntroContextValue {
  introComplete: boolean;
  introActive: boolean;
  completeIntro: () => void;
}

const IntroContext = createContext<IntroContextValue | undefined>(undefined);

const STORAGE_KEY = "skillstack-intro-seen";

export function IntroProvider({ children }: { children: ReactNode }) {
  const [introComplete, setIntroComplete] = useState(false);
  const [introActive, setIntroActive] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (seen === "true") {
      setIntroComplete(true);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntroComplete(true);
      sessionStorage.setItem(STORAGE_KEY, "true");
      return;
    }

    setIntroActive(true);
  }, []);

  const completeIntro = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setIntroComplete(true);
    setIntroActive(false);
  }, []);

  return (
    <IntroContext.Provider
      value={{ introComplete, introActive, completeIntro }}
    >
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error("useIntro must be used within IntroProvider");
  return ctx;
}
