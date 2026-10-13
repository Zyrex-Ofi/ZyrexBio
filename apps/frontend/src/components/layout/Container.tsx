import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "wide" | "profile";
}

const sizeStyles: Record<NonNullable<ContainerProps["size"]>, string> = {
  default: "max-w-5xl",
  narrow: "max-w-3xl",
  wide: "max-w-7xl",
  // Guns.lol column: narrow centered feed used by public profiles + showcase.
  profile: "max-w-[620px]",
};

export function Container({ className, size = "default", ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizeStyles[size], className)}
      {...props}
    />
  );
}
