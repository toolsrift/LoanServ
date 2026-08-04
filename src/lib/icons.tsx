import {
  Wallet,
  Building2,
  Home,
  Car,
  Landmark,
  Stethoscope,
  Calculator,
  GraduationCap,
  CreditCard,
  Factory,
  Cog,
  Briefcase,
  Bike,
  PiggyBank,
  TrendingUp,
  Coins,
  Receipt,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Wallet,
  Building2,
  Home,
  Car,
  Landmark,
  Stethoscope,
  Calculator,
  GraduationCap,
  CreditCard,
  Factory,
  Cog,
  Briefcase,
  Bike,
  PiggyBank,
  TrendingUp,
  Coins,
  Receipt,
  ShieldCheck,
};

/** Resolve a lucide icon by name, falling back to a neutral icon. */
export function getIcon(name?: string): LucideIcon {
  return (name && map[name]) || Wallet;
}
