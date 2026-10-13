import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactElement } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "brand" | "secondary" | "ghost" | "outline" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

type ButtonAsButton = BaseButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps>;

type ButtonAsLink = BaseButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> & { href: string };

// Guns.lol-style buttons: monochrome first, brand violet only for primary CTA.
// - default = white pill (highest contrast, like guns.lol "claim" buttons)
// - brand = violet pill (marketing CTA only)
// - secondary/ghost/outline = glass hairlines, no solid zinc

const variantStyles: Record<ButtonVariant, string> = {
  default:
    "bg-zinc-100 text-zinc-950 hover:bg-white shadow-[0_8px_30px_-8px_rgba(255,255,255,0.25)]",
  brand:
    "bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-600/25",
  secondary:
    "glass text-zinc-100 hover:bg-white/[0.08]",
  ghost: "text-zinc-400 hover:text-white hover:bg-white/5",
  outline:
    "border border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white",
  link: "text-zinc-300 hover:text-white underline-offset-4 hover:underline",
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "h-10 px-5 py-2 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-12 px-8 text-base",
  icon: "h-10 w-10",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]";

export function Button(props: ButtonAsLink): ReactElement;
export function Button(props: ButtonAsButton): ReactElement;
export function Button(props: ButtonAsButton | ButtonAsLink): ReactElement {
  const { variant = "default", size = "default", className, ...rest } = props;
  const classes = cn(baseClasses, variantStyles[variant], sizeStyles[size], className);

  if ("href" in props) {
    return <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} />;
  }
  return <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} />;
}

export type { ButtonVariant, ButtonSize };
