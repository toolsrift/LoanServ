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
  type LucideProps,
} from "lucide-react";
import { createElement } from "react";

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

/**
 * Renders a loan's icon by name. Use this instead of `const Icon = getIcon(…)`
 * inside a component: a component chosen during render resets its state on
 * every render (react-hooks/static-components).
 */
export function LoanIcon({ name, ...props }: { name?: string } & LucideProps) {
  return createElement(getIcon(name), props);
}
