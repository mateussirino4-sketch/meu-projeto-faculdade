import { z } from "zod";

const serverSchema = z.object({ DATABASE_URL: z.string().url(), DEMO_SESSION_SECRET: z.string().min(32) });
export function getServerEnv() { return serverSchema.parse({ DATABASE_URL: process.env.DATABASE_URL, DEMO_SESSION_SECRET: process.env.DEMO_SESSION_SECRET }); }
