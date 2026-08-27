import { describe, expect, it } from "vitest";
import { formatCurrency, maskDemoIdentifier } from "./format";
describe("format helpers", () => { it("mascara identificador fictício", () => expect(maskDemoIdentifier("DEMO-FOUND-001")).toBe("DEMO••••001")); it("formata moeda", () => expect(formatCurrency(10)).toContain("10,00")); });
