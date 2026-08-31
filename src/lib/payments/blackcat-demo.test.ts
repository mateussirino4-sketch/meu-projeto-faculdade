import { describe, expect, it } from "vitest";
import {
  BLACKCAT_DEMO_RESPONSE,
  BLACKCAT_DEMO_URL,
  createBlackcatDemoRequest,
} from "./blackcat-demo";

describe("Blackcat Pix acadêmico", () => {
  it("monta somente um descritor inexecutável com dados zerados", () => {
    const request = createBlackcatDemoRequest();

    expect(BLACKCAT_DEMO_URL).toMatch(/^https:\/\/example\.invalid\//);
    expect(request.method).toBe("POST");
    expect(request.headers["X-API-Key"]).toBe("CHAVE_FICTICIA_NAO_UTILIZAVEL");
    expect(request.body.amount).toBe(0);
    expect(request.body.customer.document.number).toBe("00000000000");
    expect(request.body.customer.phone).toBe("00000000000");
    expect(request.body.postbackUrl).toMatch(/^https:\/\/example\.invalid\//);
  });

  it("representa transactionId e os dados Pix dentro de paymentData", () => {
    expect(BLACKCAT_DEMO_RESPONSE.data.transactionId).toBe(
      "TXN-FICTICIA-000000",
    );
    expect(BLACKCAT_DEMO_RESPONSE.data.paymentData).toEqual(
      expect.objectContaining({
        qrCode: "QR_CODE_FICTICIO_NAO_PAGAVEL",
        qrCodeBase64: "data:image/png;base64,FICTICIO_NAO_PAGAVEL",
        copyPaste: "PIX_COPIA_E_COLA_FICTICIO_NAO_PAGAVEL",
      }),
    );
  });
});
