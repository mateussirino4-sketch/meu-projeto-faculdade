"use client";

import type { ReactNode } from "react";
import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";
import { Button, Card, cn } from "./ui";

export function Alert({ title, children, variant = "info" }: { title: string; children: ReactNode; variant?: "info" | "success" | "warning" | "danger" }) { const styles = { info: "border-blue-200 bg-blue-50 text-blue-950", success: "border-green-200 bg-green-50 text-green-950", warning: "border-amber-200 bg-amber-50 text-amber-950", danger: "border-red-200 bg-red-50 text-red-950" }; return <div role="status" className={cn("rounded-md border p-4", styles[variant])}><p className="font-bold">{title}</p><div className="mt-1 text-sm">{children}</div></div>; }
export function Spinner({ label = "Carregando" }: { label?: string }) { return <div role="status" className="flex items-center gap-2 text-[var(--color-muted)]"><LoaderCircle aria-hidden="true" className="size-5 animate-spin" /><span>{label}</span></div>; }
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) { return <Card className="grid place-items-center gap-3 text-center"><Inbox className="size-9 text-[var(--color-muted)]" aria-hidden="true" /><h1 className="text-xl font-bold">{title}</h1><p className="text-[var(--color-muted)]">{description}</p>{action}</Card>; }
export function ErrorState({ title, description, actionLabel, onAction }: { title: string; description: string; actionLabel?: string; onAction?: () => void }) { return <Card className="grid place-items-center gap-3 text-center"><AlertCircle className="size-9 text-[var(--color-danger)]" aria-hidden="true" /><h1 className="text-xl font-bold">{title}</h1><p className="text-[var(--color-muted)]">{description}</p>{actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}</Card>; }
