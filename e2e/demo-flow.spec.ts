import { expect, test } from "@playwright/test";

test("vídeo da home inicia automaticamente sem som", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body > footer")).toBeVisible();
  const video = page.locator("video");
  await expect(video).toHaveAttribute("autoplay", "");
  await expect(video).toHaveAttribute("muted", "");
  await expect
    .poll(() => video.evaluate((element: HTMLVideoElement) => !element.paused))
    .toBe(true);
});

async function enter(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Entrar" }).click();
  const identifier = page.getByLabel("CPF");
  await expect(identifier).toHaveValue("");
  await identifier.fill("123");
  await expect(
    page.getByRole("button", { name: "Verificar", exact: true }),
  ).toBeDisabled();
  await identifier.fill("52666402002999");
  await expect(identifier).toHaveValue("526.664.020-02");
  await page.getByRole("button", { name: "Verificar", exact: true }).click();
  await expect(page).toHaveURL(/\/verificacao$/);
  await expect(page.locator("body > footer")).toHaveCount(0);
}

test("jornada completa usa identificador e formulários de campo único", async ({
  page,
}) => {
  test.setTimeout(180000);
  await enter(page);
  await expect(
    page.getByText("Digite seu nome completo", { exact: true }),
  ).toBeVisible();
  const name = page.getByPlaceholder("Digite seu nome completo");
  await name.fill("A");
  await page.getByRole("button", { name: "Confirmar", exact: true }).click();
  await expect(
    page.getByText("Digite seu nome completo.", { exact: true }),
  ).toBeVisible();
  await name.fill("Marina Oliveira");
  await page.getByRole("button", { name: "Confirmar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "MARINA", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("radio", { name: "Desempregado(a)", exact: true }),
  ).toBeVisible();
  const income = page.getByRole("radio", {
    name: "De R$ 2.641 A R$ 6.600 (2 A 5 Salários Mínimos)",
  });
  await expect(
    page.getByRole("button", { name: "Confirmar", exact: true }),
  ).toBeDisabled();
  await income.click();
  await expect(income).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: "Confirmar", exact: true }).click();
  await expect(
    page.getByText("Digite sua data de nascimento", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "MARINA", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Digite sua data de nascimento", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Voltar" }).click();
  await expect(
    page.getByRole("radio", {
      name: "De R$ 2.641 A R$ 6.600 (2 A 5 Salários Mínimos)",
    }),
  ).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: "Confirmar", exact: true }).click();
  await page.locator('input[type="date"]').fill("1992-04-18");
  await page.getByRole("button", { name: "Confirmar", exact: true }).click();
  const debt = page.getByRole("radio", { name: "Cartão De Crédito" });
  await expect(
    page.getByRole("button", { name: "Confirmar", exact: true }),
  ).toBeDisabled();
  await debt.click();
  await expect(debt).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: "Confirmar", exact: true }).click();
  await page.getByPlaceholder("Digite seu e-mail").fill("marina@g");
  const emailSuggestion = page.getByRole("option", {
    name: "marina@gmail.com",
  });
  await expect(emailSuggestion).toBeVisible();
  await emailSuggestion.click();
  await expect(page.getByPlaceholder("Digite seu e-mail")).toHaveValue(
    "marina@gmail.com",
  );
  await page.getByRole("button", { name: "Confirmar", exact: true }).click();
  await page.getByPlaceholder("(00) 00000-0000").fill("11900000001");
  await page.getByRole("button", { name: "Confirmar", exact: true }).click();
  await expect(page).toHaveURL(/\/saiba-mais$/);
  await expect(page.getByRole("button", { name: "Voltar" })).toHaveCount(0);

  const lessons = [
    ["Novo Desenrola Brasil", "/media/etapa-1.jpg"],
    ["Acesso ao Portal de Renegociação", "/media/etapa-2.webp"],
    ["Renegociação com Desconto", "/media/etapa-3.webp"],
    ["Limpeza do Nome", "/media/etapa-4.webp"],
    ["Taxa de Adesão", "/media/etapa-5.jpeg"],
  ] as const;

  for (const [index, [title, imagePath]] of lessons.entries()) {
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
    const image = page.locator("main img");
    await expect(image).toHaveAttribute("src", imagePath);
    await expect
      .poll(() =>
        image.evaluate((element: HTMLImageElement) => element.naturalWidth),
      )
      .toBeGreaterThan(0);

    if (index < lessons.length - 1)
      await page.getByRole("button", { name: "Avançar" }).click();
  }
  await page.getByRole("button", { name: "Finalizar" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Parabéns! Cadastro Aprovado com Sucesso",
    }),
  ).toBeVisible({ timeout: 30000 });
  await page.getByRole("button", { name: "Renegociar" }).first().click();
  await page.getByRole("button", { name: "Cartão de Crédito" }).click();
  for (let step = 0; step < 4; step++) {
    await page.getByRole("button", { name: "Prosseguir" }).click();
  }
  await page.getByRole("button", { name: "Confirmar acordo" }).click();
  await page.getByRole("button", { name: "Prosseguir" }).click();
  await page.getByRole("button", { name: "Finalizar Cadastro" }).click();
  await expect(page).toHaveURL(/\/pagamento$/);
  await page.getByRole("button", { name: "Finalizar Cadastro" }).click();
  await expect(page).toHaveURL(/\/pix-payment$/);
  await page.getByRole("button", { name: "Confirmar simulação" }).click();
  await page.getByRole("button", { name: "Concluir simulação" }).click();
  await expect(
    page.getByRole("heading", { name: "Cadastro Concluído!" }),
  ).toBeVisible();
});

test("etapa de nome funciona em mobile e voltar preserva o padrão", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await enter(page);
  await expect(
    page.getByText("Digite seu nome completo", { exact: true }),
  ).toBeInViewport();
  await page
    .getByPlaceholder("Digite seu nome completo")
    .fill("Marina Oliveira");
  await page.getByRole("button", { name: "Confirmar", exact: true }).click();
  await page.getByRole("button", { name: "Voltar" }).click();
  await expect(
    page.getByText("Digite seu nome completo", { exact: true }),
  ).toBeVisible();
});

test("perfil de erro mantém estado recuperável", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    const b = await (await fetch("/api/demo-users/90000000009")).json();
    localStorage.setItem(
      "acorda_demo_flow_v1",
      JSON.stringify({
        version: 1,
        profile: b.data,
        answers: {
          fullName: "Pessoa de Teste",
          monthlyIncome: "0",
          birthDate: "1990-01-01",
          debtType: "OTHER",
          email: "pessoa@example.test",
          phone: "(11) 90000-0000",
        },
        verificationStep: 5,
        contentStep: 4,
        updatedAt: new Date().toISOString(),
      }),
    );
  });
  await page.goto("/verify-availability");
  await expect(
    page.getByText("Não foi possível concluir a análise"),
  ).toBeVisible({ timeout: 25000 });
  await expect(
    page.getByRole("button", { name: "Tentar novamente" }),
  ).toBeVisible();
});
