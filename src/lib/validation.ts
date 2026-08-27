import { z } from "zod";

export const eligibilitySchema = z.object({ userId: z.string().uuid(), scenario: z.enum(["ELIGIBLE", "INELIGIBLE", "ERROR"]).default("ELIGIBLE") });
export const transactionCreateSchema = z.object({ userId: z.string().uuid(), offerId: z.string().uuid().optional(), amount: z.coerce.number().positive().max(10_000), idempotencyKey: z.string().min(8).max(100) });
export const transactionUpdateSchema = z.object({ status: z.enum(["PENDING", "APPROVED", "FAILED", "EXPIRED", "CANCELLED"]) });
export const conversationEventSchema = z.object({ sessionId: z.string().uuid(), direction: z.enum(["INCOMING", "OUTGOING", "SYSTEM"]), eventType: z.string().min(1).max(60), content: z.string().min(1).max(4_000), sequence: z.number().int().positive() });
