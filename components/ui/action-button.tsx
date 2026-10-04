import Link from "next/link"
import type { ButtonHTMLAttributes, ComponentProps } from "react"

type Variant = "primary" | "secondary" | "ghost" | "danger"

const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2338D1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F5F7] disabled:cursor-not-allowed disabled:opacity-50"

const variants: Record<Variant, string> = {
  primary: "bg-[#2338D1] text-white hover:bg-[#1B2CA8]",
  secondary: "border border-[#C5CCDA] bg-white text-[#0F1A2E] hover:border-[#0F1A2E]",
  ghost: "text-[#5B6679] hover:bg-[#E9ECF2] hover:text-[#0F1A2E]",
  danger: "border border-[#F4C4BF] bg-white text-[#B3261E] hover:bg-[#FCE9E7]",
}

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`.trim()
}

export function ActionButton({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={buttonClass(variant, className)} {...props} />
}

export function ActionLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={buttonClass(variant, className)} {...props} />
}
