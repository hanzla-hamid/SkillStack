"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface OutlineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const OutlineButton = React.forwardRef<
  HTMLButtonElement,
  OutlineButtonProps
>(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-lg border border-gold/30 bg-transparent px-7 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-all duration-300",
        "hover:border-gold hover:bg-gold/5 hover:text-gold active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
        className,
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
});
OutlineButton.displayName = "OutlineButton";
