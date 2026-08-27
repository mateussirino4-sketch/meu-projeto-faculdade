import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 45_000,
  expect: { timeout: 8_000 },
  use: { baseURL: "http://localhost:3000", channel: "chrome", trace: "retain-on-failure" },
  workers: 1,
});
