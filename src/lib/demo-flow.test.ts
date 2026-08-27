import { describe, expect, it } from "vitest";
import { formatNumericIdentifier, normalizeNumericIdentifier, validateNumericIdentifier } from "./demo-flow";

describe("identificador numérico local", () => {
  it("aceita exatamente 11 dígitos", () => expect(validateNumericIdentifier("10000000001")).toBe(""));
  it("rejeita menos de 11 dígitos", () => expect(validateNumericIdentifier("1234567890")).toContain("11 números"));
  it("remove caracteres não numéricos", () => expect(normalizeNumericIdentifier("100.000.000-01")).toBe("10000000001"));
  it("impede mais de 11 dígitos", () => expect(normalizeNumericIdentifier("123456789012345")).toBe("12345678901"));
  it("não calcula dígitos verificadores", () => expect(validateNumericIdentifier("11111111111")).toBe(""));
  it("aplica a máscara somente na apresentação", () => { expect(formatNumericIdentifier("52666402002")).toBe("526.664.020-02"); expect(normalizeNumericIdentifier(formatNumericIdentifier("52666402002"))).toBe("52666402002"); });
});
