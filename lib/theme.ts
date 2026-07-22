import type { PrimaryColor } from "@/types/page";

export type ThemeClasses = {
  bg: string;
  text: string;
  border: string;
  button: string;
  buttonHover: string;
  softBg: string;
  ring: string;
  gradient: string;
};

export function getThemeClasses(primaryColor: PrimaryColor): ThemeClasses {
  const themes: Record<PrimaryColor, ThemeClasses> = {
    blue: {
      bg: "bg-blue-600",
      text: "text-blue-600",
      border: "border-blue-200",
      button: "bg-blue-600 text-white",
      buttonHover: "hover:bg-blue-700",
      softBg: "bg-blue-50",
      ring: "ring-blue-100",
      gradient: "from-blue-50 to-white",
    },
    green: {
      bg: "bg-emerald-600",
      text: "text-emerald-600",
      border: "border-emerald-200",
      button: "bg-emerald-600 text-white",
      buttonHover: "hover:bg-emerald-700",
      softBg: "bg-emerald-50",
      ring: "ring-emerald-100",
      gradient: "from-emerald-50 to-white",
    },
    purple: {
      bg: "bg-violet-600",
      text: "text-violet-600",
      border: "border-violet-200",
      button: "bg-violet-600 text-white",
      buttonHover: "hover:bg-violet-700",
      softBg: "bg-violet-50",
      ring: "ring-violet-100",
      gradient: "from-violet-50 to-white",
    },
    orange: {
      bg: "bg-orange-600",
      text: "text-orange-600",
      border: "border-orange-200",
      button: "bg-orange-600 text-white",
      buttonHover: "hover:bg-orange-700",
      softBg: "bg-orange-50",
      ring: "ring-orange-100",
      gradient: "from-orange-50 to-white",
    },
    black_gold: {
      bg: "bg-slate-950",
      text: "text-amber-600",
      border: "border-amber-200",
      button: "bg-slate-950 text-amber-50",
      buttonHover: "hover:bg-slate-800",
      softBg: "bg-amber-50",
      ring: "ring-amber-100",
      gradient: "from-slate-50 to-amber-50",
    },
    pink: {
      bg: "bg-pink-600",
      text: "text-pink-600",
      border: "border-pink-200",
      button: "bg-pink-600 text-white",
      buttonHover: "hover:bg-pink-700",
      softBg: "bg-pink-50",
      ring: "ring-pink-100",
      gradient: "from-pink-50 to-white",
    },
  };

  return themes[primaryColor] ?? themes.blue;
}
