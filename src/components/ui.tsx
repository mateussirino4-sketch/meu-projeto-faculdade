import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function Container({ children, className }: { children: ReactNode; className?: string }) { return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>; }
export function Card({ children, className }: { children: ReactNode; className?: string }) { return <section className={cn("rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]", className)}>{children}</section>; }
export function Button({ className, type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) { return <button type={type} className={cn("min-h-11 rounded-[var(--radius-pill)] bg-[var(--color-primary)] px-5 py-2 font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60", className)} {...props} />; }
export function Input({ label, error, id, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) { const inputId = id ?? props.name; return <div className="grid gap-1.5"><label htmlFor={inputId} className="text-sm font-semibold">{label}</label><input id={inputId} aria-invalid={Boolean(error)} aria-describedby={error ? `${inputId}-error` : undefined} className={cn("min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-3 focus:border-[var(--color-primary)]", className)} {...props} />{error && <p id={`${inputId}-error`} className="text-sm text-[var(--color-danger)]">{error}</p>}</div>; }
